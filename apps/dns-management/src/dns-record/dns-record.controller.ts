import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { DnsRecordService } from './dns-record.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'lib/db/module/admin.schema';
import { Response } from 'express';

@Controller('dns-record')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.SUB_ADMIN)
export class DnsRecordController {
    constructor(private readonly dnsService: DnsRecordService) { }

    @Get()
    async findAll(@Res() res: Response) {
        const { statusCode, ...response } = await this.dnsService.findAll();
        return res.status(statusCode).json(response);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const { statusCode, ...response } = await this.dnsService.findOne(id);
        return res.status(statusCode).json(response);
    }

}
