import { Module } from '@nestjs/common';
import { DnsAnalyticsController } from './dns-analytics.controller';
import { DnsAnalyticsService } from './dns-analytics.service';
import { ModelModule } from '../model/model.module';

@Module({
  imports: [
    ModelModule
  ],
  controllers: [DnsAnalyticsController],
  providers: [DnsAnalyticsService]
})
export class DnsAnalyticsModule { }
