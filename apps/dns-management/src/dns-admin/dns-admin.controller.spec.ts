import { Test, TestingModule } from '@nestjs/testing';
import { DnsAdminController } from './dns-admin.controller';

describe('DnsAdminController', () => {
  let controller: DnsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DnsAdminController],
    }).compile();

    controller = module.get<DnsAdminController>(DnsAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
