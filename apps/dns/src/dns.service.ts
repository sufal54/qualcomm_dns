import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as dgram from "node:dgram";
import { redis } from "lib/cache/redis.provider";
import { DnsRecordDocument } from "lib/db/module/dnsRecord.schema";


@Injectable()
export class DnsService implements OnModuleInit {
  private server = dgram.createSocket("udp4");

  constructor(
    @InjectModel("DnsRecord") private dnsModel: Model<DnsRecordDocument>,
  ) { }

  onModuleInit() {
    this.start();
  }

  private start() {

    console.log("DNS server starting...");
    this.server.on("message", (msg, rinfo) =>
      this.handleQuery(msg, rinfo),
    );

    this.server.bind(53530, "0.0.0.0", () =>
      console.log("DNS server listening on :53530"),
    );
  }


  private decodeDomain(buf: Buffer, offset: number): string | null {
    const parts: string[] = [];
    while (true) {
      const len = buf[offset];
      if (len === 0) return parts.join(".");
      parts.push(buf.slice(offset + 1, offset + 1 + len).toString());
      offset += len + 1;
    }
  }

  private ipBytes(ip: string) {
    return Buffer.from(ip.split(".").map(Number));
  }


  private async handleQuery(msg: Buffer, rinfo: any) {
    const id = msg.subarray(0, 2);
    const domain = this.decodeDomain(msg, 12)?.toLowerCase();
    if (!domain) return;

    console.log("QUERY:", domain);
    const redisKey = domain;

    const cached = await redis.get(redisKey);
    if (cached) {
      const data = JSON.parse(cached);

      if (data.blocked) {
        console.log("REDIS BLOCK");
        return this.sendNXDOMAIN(msg, rinfo, id, domain);
      }

      if (data.redirectIp) {
        console.log("REDIS REDIRECT");
        return this.respond(msg, rinfo, id, domain, data.redirectIp, data.ttl);
      }

      console.log("REDIS HIT");
      return this.respond(msg, rinfo, id, domain, data.ip, data.ttl);
    }

    const record = await this.dnsModel.findOne({ domain });
    if (record) {
      console.log("MONGO HIT");

      const cachePayload = {
        ip: record.ip,
        ttl: record.ttl,
        blocked: record.blocked,
      };

      await redis.set(
        redisKey,
        JSON.stringify(cachePayload),
        "EX",
        300,
      );

      if (record.blocked) {
        console.log("BLOCKED (DB)");
        return this.sendNXDOMAIN(msg, rinfo, id, domain);
      }

      if (record.ip) {
        console.log("REDIRECT (DB)");
        return this.respond(
          msg,
          rinfo,
          id,
          domain,
          record.ip,
          record.ttl,
        );
      }

      return this.respond(msg, rinfo, id, domain, record.ip || "", record.ttl);
    }

    console.log("FORWARD → 8.8.8.8");
    this.forwardToGoogle(msg, rinfo, domain);
  }


  private forwardToGoogle(msg: Buffer, rinfo: any, domain: string) {
    const upstream = dgram.createSocket("udp4");
    upstream.send(msg, 53, "8.8.8.8");

    upstream.on("message", async res => {
      this.server.send(res, rinfo.port, rinfo.address);
      upstream.close();

      const ip = this.extractIP(res);
      const ttl = this.extractTTL(res) || 300;
      if (!ip) return;

      await this.dnsModel.updateOne(
        { domain },
        {
          domain,
          ip,
          ttl,
          blocked: false,
          redirectIp: null,
          updatedAt: new Date(),
        },
        { upsert: true },
      );

      await redis.set(
        domain,
        JSON.stringify({
          domain,
          ip,
          ttl,
          blocked: false,
          redirectIp: null,
          updatedAt: new Date(),
        }),
        "EX",
        ttl,
      );
    });
  }

  /** Extract ip from packet */
  private extractIP(buf: Buffer): string | null {
    const idx = buf.indexOf(Buffer.from([0x00, 0x04]));
    if (idx === -1) return null;
    return [...buf.slice(idx + 2, idx + 6)].join(".");
  }
  /** Extract ttl from packet */
  private extractTTL(buf: Buffer): number {
    const idx = buf.indexOf(Buffer.from([0x00, 0x01, 0x00, 0x01]));
    return idx !== -1 ? buf.readUInt32BE(idx + 4) : 300;
  }


  private respond(
    msg: Buffer,
    rinfo: any,
    id: Buffer,
    domain: string,
    ip: string,
    ttl: number,
  ) {
    const nameEnd =
      12 + domain.split(".").reduce((a, l) => a + l.length + 1, 0) + 1;

    const question = msg.subarray(12, nameEnd + 4);

    const header = Buffer.concat([
      id,
      Buffer.from([0x81, 0x80]),
      msg.subarray(4, 6),
      Buffer.from([0x00, 0x01]),
      Buffer.from([0x00, 0x00]),
      Buffer.from([0x00, 0x00]),
    ]);

    const answer = Buffer.concat([
      Buffer.from([0xc0, 0x0c]),
      Buffer.from([0x00, 0x01]),
      Buffer.from([0x00, 0x01]),
      Buffer.from([
        (ttl >> 24) & 0xff,
        (ttl >> 16) & 0xff,
        (ttl >> 8) & 0xff,
        ttl & 0xff,
      ]),
      Buffer.from([0x00, 0x04]),
      this.ipBytes(ip),
    ]);

    this.server.send(
      Buffer.concat([header, question, answer]),
      rinfo.port,
      rinfo.address,
    );
  }
  /** Send DNS Query not resolved or Blocked
   * @param {Buffer} mag Res Message 
   * @param {any} rinfo Remote/Client Information
   * @param {Buffer} id Unique id
   * @param {string} domain Domain
   */
  private sendNXDOMAIN(
    msg: Buffer,
    rinfo: any,
    id: Buffer,
    domain: string,
  ) {
    const nameEnd =
      12 + domain.split(".").reduce((a, l) => a + l.length + 1, 0) + 1;

    const question = msg.subarray(12, nameEnd + 4);

    const res = Buffer.concat([
      id,
      Buffer.from([0x81, 0x83]), // NXDOMAIN
      msg.subarray(4, 6),
      Buffer.from([0x00, 0x00]),
      Buffer.from([0x00, 0x00]),
      Buffer.from([0x00, 0x00]),
      question,
    ]);

    this.server.send(res, rinfo.port, rinfo.address);
  }
}
