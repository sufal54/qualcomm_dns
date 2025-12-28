import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DnsAdminDocument, Role } from 'lib/db/module/admin.schema';
import { Model } from 'mongoose';

@Injectable()
export class DnsAdminService {
    constructor(
        @InjectModel('DnsAdmin')
        private adminModel: Model<DnsAdminDocument>,
    ) { }

    async createSubAdmin(name: string) {
        try {
            const subAdmin = await this.adminModel.create({
                name,
                role: Role.SUB_ADMIN,
            });
            return {
                success: true,
                statusCode: HttpStatus.OK,
                subAdmin
            }
        } catch (err) {
            return {
                success: true,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
        }

    }
}
