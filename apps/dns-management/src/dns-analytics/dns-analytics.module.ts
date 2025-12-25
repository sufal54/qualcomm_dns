import { Module } from '@nestjs/common';
import { DnsAnalyticsController } from './dns-analytics.controller';
import { DnsAnalyticsService } from './dns-analytics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DnsRecordSchema } from 'lib/db/module/dnsRecord.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DnsRecord', schema: DnsRecordSchema }
    ]),
  ],
  controllers: [DnsAnalyticsController],
  providers: [DnsAnalyticsService]
})
export class DnsAnalyticsModule { }
