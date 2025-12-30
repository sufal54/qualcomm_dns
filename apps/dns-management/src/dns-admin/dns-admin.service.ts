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

    async createSubAdmin(name: string, password: string) {
        try {
            const subAdmin = await this.adminModel.create({
                name,
                password,
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

    async deleteSubAdmin(name: string) {
        try {
            const subAdmin = await this.adminModel.deleteOne({
                name
            });

            if (subAdmin.deletedCount == 0) {
                return {
                    success: true,
                    statusCode: HttpStatus.NO_CONTENT,
                    message: "User not exists"
                }
            }
            return {
                success: true,
                statusCode: HttpStatus.OK,
                subAdmin
            }
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
        }
    }
}
