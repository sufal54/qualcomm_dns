import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DnsRecordDocument } from 'lib/db/module/dnsRecord.schema';
import { Model } from 'mongoose';

@Injectable()
export class DnsAnalyticsService {

    constructor(
        @InjectModel('DnsRecord') private readonly dnsRecordModel: Model<DnsRecordDocument>,
    ) { }

    async getTotalRecords() {
        return this.dnsRecordModel.countDocuments();
    }

    async getBlockedStats() {
        return this.dnsRecordModel.aggregate([
            { $group: { _id: "$blocked", count: { $sum: 1 } } }
        ]);
    }

    async getRedirectStats() {
        return this.dnsRecordModel.countDocuments({ redirectIp: { $ne: null } });
    }

    async getTtlDistribution() {
        return this.dnsRecordModel.aggregate([
            {
                $bucket: {
                    groupBy: "$ttl",
                    boundaries: [0, 60, 300, 600, 1800, 3600],
                    default: "Other",
                    output: { count: { $sum: 1 } }
                }
            }
        ]);
    }
    async getRecentUpdates(limit = 10) {
        return this.dnsRecordModel.find()
            .sort({ updatedAt: -1 })
            .limit(limit);
    }

    async getTopIps(limit = 10) {
        return this.dnsRecordModel.aggregate([
            { $match: { ip: { $ne: null } } },
            { $group: { _id: "$ip", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit }
        ]);
    }

    async getAnalytics() {
        const [total, blocked, redirects, ttl, recent, topIps] = await Promise.all([
            this.getTotalRecords(),
            this.getBlockedStats(),
            this.getRedirectStats(),
            this.getTtlDistribution(),
            this.getRecentUpdates(),
            this.getTopIps()
        ]);

        return { total, blocked, redirects, ttl, recent, topIps };
    }
}
