import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'lib/db/module/admin.schema';
import { DnsAdminService } from './dns-admin.service';
import { Response } from 'express';
import { AdminDto, DeleteAdminDto } from '../dto/admin.dto';
import { RecordDto, UpdateRecordDto } from '../dto/record.dto';

@Controller('dns-admin')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class DnsAdminController {
    constructor(private readonly adminService: DnsAdminService) { }


    @Get('subadmins')
    async getAllSubAdmins(@Res() res: Response) {
        const { statusCode, ...response } =
            await this.adminService.getAllSubAdmins();
        return res.status(statusCode).json(response);
    }


    @Get('subadmin/:name')
    async getSubAdminByName(
        @Param('name') name: string,
        @Res() res: Response,
    ) {
        const { statusCode, ...response } =
            await this.adminService.getSubAdminByName(name);
        return res.status(statusCode).json(response);
    }
    @Post('create-subadmin')
    async createSubAdmin(@Body() body: AdminDto, @Res() res: Response) {
        const { statusCode, ...responce } = await this.adminService.createSubAdmin(body.name, body.password);
        return res.status(statusCode).json(responce);
    }

    @Delete('delete-subadmin')
    async DeleteSubAdmin(@Body() body: DeleteAdminDto, @Res() res: Response) {
        const { statusCode, ...responce } = await this.adminService.deleteSubAdmin(body.name);
        return res.status(statusCode).json(responce);
    }

    @Post("create-record")
    async createRecord(@Body() body: RecordDto, @Res() res: Response) {
        const { statusCode, ...response } = await this.adminService.createRecord(body);
        return res.status(statusCode).json(response);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateRecordDto,
        @Res() res: Response
    ) {
        const { statusCode, ...response } = await this.adminService.updateRecord(id, dto);
        return res.status(statusCode).json(response);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        const { statusCode, ...response } = await this.adminService.removeRecord(id);
        return res.status(statusCode).json(response);
    }
}
