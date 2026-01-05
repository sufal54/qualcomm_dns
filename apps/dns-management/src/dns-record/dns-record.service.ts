import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DnsRecordDocument } from "lib/db/module/dnsRecord.schema";
import { Model } from "mongoose";

@Injectable()
export class DnsRecordService {
    constructor(
        @InjectModel("DnsRecord")
        private dnsModel: Model<DnsRecordDocument>,
    ) { }


    async findAll() {
        try {
            const records = await this.dnsModel.find();
            return {
                success: true,
                statusCode: HttpStatus.OK,
                records,
            };
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            };
        }
    }

    async findOne(id: string) {
        try {
            const record = await this.dnsModel.findById(id);

            if (!record) {
                return {
                    success: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "Record not found",
                };
            }

            return {
                success: true,
                statusCode: HttpStatus.OK,
                record,
            };
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            };
        }
    }


}
