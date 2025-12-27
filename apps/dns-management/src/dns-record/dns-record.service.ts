import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DnsRecordDocument } from 'lib/db/module/dnsRecord.schema';
import { Model } from 'mongoose';

@Injectable()
export class DnsRecordService {
    constructor(
        @InjectModel('DnsRecord')
        private dnsModel: Model<DnsRecordDocument>,
    ) { }

    create(data: Partial<DnsRecordDocument>) {
        return this.dnsModel.create(data);
    }
}
