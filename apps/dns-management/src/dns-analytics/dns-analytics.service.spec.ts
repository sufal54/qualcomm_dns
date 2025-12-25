import { Test, TestingModule } from '@nestjs/testing';
import { DnsAnalyticsService } from './dns-analytics.service';

describe('DnsAnalyticsService', () => {
  let service: DnsAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DnsAnalyticsService],
    }).compile();

    service = module.get<DnsAnalyticsService>(DnsAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
