import { Test, TestingModule } from '@nestjs/testing';
import { DnsAdminService } from './dns-admin.service';

describe('DnsAdminService', () => {
  let service: DnsAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DnsAdminService],
    }).compile();

    service = module.get<DnsAdminService>(DnsAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
