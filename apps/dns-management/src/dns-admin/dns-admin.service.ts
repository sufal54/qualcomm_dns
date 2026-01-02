import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DnsAdminDocument, Role } from 'lib/db/module/admin.schema';
import { Model } from 'mongoose';
import { RecordDto, UpdateRecordDto } from '../dto/record.dto';
import { DnsRecordDocument } from 'lib/db/module/dnsRecord.schema';

@Injectable()
export class DnsAdminService {
    constructor(
        @InjectModel('DnsAdmin')
        private adminModel: Model<DnsAdminDocument>,
        @InjectModel('DnsRecord')
        private dnsModel: Model<DnsRecordDocument>,
    ) { }

    async getAllSubAdmins() {
        try {
            const subAdmins = await this.adminModel.find().select("-password");

            return {
                success: true,
                statusCode: HttpStatus.OK,
                list: subAdmins,
            };
        } catch {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            };
        }
    }

    async getSubAdminByName(name: string) {
        try {
            const subAdmin = await this.adminModel.findOne(
                { name, role: Role.SUB_ADMIN },
                { password: 0 },
            );

            if (!subAdmin) {
                return {
                    success: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Sub admin not found',
                };
            }

            return {
                success: true,
                statusCode: HttpStatus.OK,
                subAdmin,
            };
        } catch {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            };
        }
    }


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

    async createRecord(data: RecordDto) {
        try {
            const record = await this.dnsModel.create(data);
            return {
                success: false,
                statusCode: HttpStatus.OK,
                record
            }
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }
        }
    }

    async updateRecord(id: string, dto: UpdateRecordDto) {
        try {
            const updated = await this.dnsModel.findByIdAndUpdate(
                id,
                dto,
                { new: true },
            );

            if (!updated) {
                return {
                    success: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Record not found',
                };
            }

            return {
                success: true,
                statusCode: HttpStatus.OK,
                record: updated,
            };
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            };
        }
    }

    async removeRecord(id: string) {
        try {
            const deleted = await this.dnsModel.findByIdAndDelete(id);

            if (!deleted) {
                return {
                    success: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Record not found',
                };
            }

            return {
                success: true,
                statusCode: HttpStatus.OK,
                message: 'Record deleted successfully',
            };
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            };
        }
    }
}
