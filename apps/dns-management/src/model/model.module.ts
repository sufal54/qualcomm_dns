import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DnsRecordSchema } from 'lib/db/module/dnsRecord.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'DnsRecord', schema: DnsRecordSchema }
        ]),
    ]
})
export class ModelModule { }
