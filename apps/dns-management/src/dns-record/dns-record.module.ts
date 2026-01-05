import { Module } from "@nestjs/common";
import { ModelModule } from "../model/model.module";
import { DnsRecordController } from "./dns-record.controller";
import { DnsRecordService } from "./dns-record.service";

@Module({
    imports: [
        ModelModule
    ],
    controllers: [DnsRecordController],
    providers: [DnsRecordService]
})
export class DnsRecordModule { }
