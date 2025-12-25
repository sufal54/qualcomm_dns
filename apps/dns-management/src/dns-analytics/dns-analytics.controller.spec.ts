import { Test, TestingModule } from '@nestjs/testing';
import { DnsAnalyticsController } from './dns-analytics.controller';

describe('DnsAnalyticsController', () => {
  let controller: DnsAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DnsAnalyticsController],
    }).compile();

    controller = module.get<DnsAnalyticsController>(DnsAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
