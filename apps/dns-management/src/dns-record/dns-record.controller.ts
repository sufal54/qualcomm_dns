import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { DnsRecordService } from './dns-record.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'lib/db/module/admin.schema';

@Controller('dns-record')
@UseGuards(RolesGuard)
export class DnsRecordController {
    constructor(private readonly dnsService: DnsRecordService) { }

    @Post()
    @Roles(Role.ADMIN)
    createRecord(@Body() body) {
        return this.dnsService.create(body);
    }
}
