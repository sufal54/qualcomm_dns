import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DnsRecordDocument } from 'lib/db/module/dnsRecord.schema';
import { Model } from 'mongoose';
import { RecordDto, UpdateRecordDto } from '../dto/record.dto';

@Injectable()
export class DnsRecordService {
    constructor(
        @InjectModel('DnsRecord')
        private dnsModel: Model<DnsRecordDocument>,
    ) { }

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

    async findAll() {
        try {
            const records = await this.dnsModel.find();
            return {
                success: true,
                statusCode: HttpStatus.OK,
                records,
            };
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            };
        }
    }

    async findOne(id: string) {
        try {
            const record = await this.dnsModel.findById(id);

            if (!record) {
                return {
                    success: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Record not found',
                };
            }

            return {
                success: true,
                statusCode: HttpStatus.OK,
                record,
            };
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            };
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
