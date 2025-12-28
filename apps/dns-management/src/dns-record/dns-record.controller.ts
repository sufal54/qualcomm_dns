import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { DnsRecordService } from './dns-record.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'lib/db/module/admin.schema';
import { RecordDto, UpdateRecordDto } from '../dto/record.dto';
import { response, Response } from 'express';

@Controller('dns-record')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class DnsRecordController {
    constructor(private readonly dnsService: DnsRecordService) { }

    @Post()
    async createRecord(@Body() body: RecordDto, @Res() res: Response) {
        const { statusCode, ...response } = await this.dnsService.createRecord(body);
        return res.status(statusCode).json(response);
    }

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

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateRecordDto,
        @Res() res: Response
    ) {
        const { statusCode, ...response } = await this.dnsService.updateRecord(id, dto);
        return res.status(statusCode).json(response);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        const { statusCode, ...response } = await this.dnsService.removeRecord(id);
        return res.status(statusCode).json(response);
    }
}
