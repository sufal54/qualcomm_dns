import { Test, TestingModule } from '@nestjs/testing';
import { DnsRecordController } from './dns-record.controller';

describe('DnsRecordController', () => {
  let controller: DnsRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DnsRecordController],
    }).compile();

    controller = module.get<DnsRecordController>(DnsRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
