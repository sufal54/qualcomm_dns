import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'lib/db/module/admin.schema';
import { DnsAdminService } from './dns-admin.service';
import { Response } from 'express';

@Controller('dns-admin')
@UseGuards(RolesGuard)
export class DnsAdminController {
    constructor(private readonly adminService: DnsAdminService) { }

    @Post('create-subadmin')
    @Roles(Role.ADMIN)
    async createSubAdmin(@Body() body: { name: string }, @Res() res: Response) {
        const { statusCode, ...responce } = await this.adminService.createSubAdmin(body.name);
        return res.status(statusCode).json(responce);
    }
}
