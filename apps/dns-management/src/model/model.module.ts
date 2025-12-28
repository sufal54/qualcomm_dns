import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DnsAdmin } from 'lib/db/module/admin.schema';
import { DnsRecordSchema } from 'lib/db/module/dnsRecord.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'DnsRecord', schema: DnsRecordSchema },
            { name: "DnsAdmin", schema: DnsAdmin }
        ]),
    ],
    exports: [MongooseModule]
})
export class ModelModule { }
