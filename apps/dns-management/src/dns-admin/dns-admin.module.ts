import { Module } from '@nestjs/common';
import { DnsAdminController } from './dns-admin.controller';
import { DnsAdminService } from './dns-admin.service';

@Module({
  controllers: [DnsAdminController],
  providers: [DnsAdminService]
})
export class DnsAdminModule {}
