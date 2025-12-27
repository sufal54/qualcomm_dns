import { Test, TestingModule } from '@nestjs/testing';
import { DnsRecordService } from './dns-record.service';

describe('DnsRecordService', () => {
  let service: DnsRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DnsRecordService],
    }).compile();

    service = module.get<DnsRecordService>(DnsRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
