import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'lib/db/module/admin.schema';
import { DnsAdminService } from './dns-admin.service';
import { Response } from 'express';
import { AdminDto } from '../dto/admin.dto';

@Controller('dns-admin')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class DnsAdminController {
    constructor(private readonly adminService: DnsAdminService) { }

    @Post('create-subadmin')
    async createSubAdmin(@Body() body: AdminDto, @Res() res: Response) {
        const { statusCode, ...responce } = await this.adminService.createSubAdmin(body.name, body.password);
        return res.status(statusCode).json(responce);
    }
}
