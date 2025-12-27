import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DnsAdminDocument, Role } from 'lib/db/module/admin.schema';
import { Model } from 'mongoose';

@Injectable()
export class DnsAdminService {
    constructor(
        @InjectModel('DnsAdmin')
        private adminModel: Model<DnsAdminDocument>,
    ) { }

    createSubAdmin(name: string) {
        return this.adminModel.create({
            name,
            role: Role.SUB_ADMIN,
        });
    }
}
