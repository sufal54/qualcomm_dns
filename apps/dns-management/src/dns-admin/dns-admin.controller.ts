import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'lib/db/module/admin.schema';
import { DnsAdminService } from './dns-admin.service';

@Controller('dns-admin')
@UseGuards(RolesGuard)
export class DnsAdminController {
    constructor(private readonly adminService: DnsAdminService) { }

    @Post('create-subadmin')
    @Roles(Role.ADMIN)
    createSubAdmin(@Body() body: { name: string }) {
        return this.adminService.createSubAdmin(body.name);
    }
}
