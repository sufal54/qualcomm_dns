import { Module } from "@nestjs/common";
import { DnsAdminController } from "./dns-admin.controller";
import { DnsAdminService } from "./dns-admin.service";
import { ModelModule } from "../model/model.module";

@Module({
  imports: [
    ModelModule
  ],
  controllers: [DnsAdminController],
  providers: [DnsAdminService]
})
export class DnsAdminModule { }
