import { Module } from "@nestjs/common";
import { DnsService } from "./dns.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DnsRecordSchema } from "lib/db/module/dnsRecord.schema";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.local"
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGO_URL"),
      }),
    }),

    MongooseModule.forFeature([
      { name: "DnsRecord", schema: DnsRecordSchema },
    ]),
  ],
  controllers: [],
  providers: [DnsService],
})
export class DnsModule { }
