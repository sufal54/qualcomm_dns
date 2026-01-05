import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DnsRecordDocument } from "lib/db/module/dnsRecord.schema";
import { Model } from "mongoose";

@Injectable()
export class DnsAnalyticsService {

    constructor(
        @InjectModel("DnsRecord") private readonly dnsRecordModel: Model<DnsRecordDocument>,
    ) { }

    async getTotalRecords() {
        try {
            const list = await this.dnsRecordModel.countDocuments();
            return {
                success: true,
                statusCode: HttpStatus.OK,
                list
            }
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            }
        }
    }

    async getBlockedStats() {
        try {
            const list = await this.dnsRecordModel.aggregate([
                { $group: { _id: "$blocked", count: { $sum: 1 } } }
            ]);

            return {
                success: true,
                statusCode: HttpStatus.OK,
                list
            }
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            }
        }
    }

    async getRedirectStats() {
        try {
            const list = await this.dnsRecordModel.countDocuments({ redirectIp: { $ne: null } });
            return {
                success: true,
                statusCode: HttpStatus.OK,
                list
            }
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            }
        }
    }

    async getTtlDistribution() {
        try {
            const list = await this.dnsRecordModel.aggregate([
                {
                    $bucket: {
                        groupBy: "$ttl",
                        boundaries: [0, 60, 300, 600, 1800, 3600],
                        default: "Other",
                        output: { count: { $sum: 1 } }
                    }
                }
            ]);
            return {
                success: true,
                statusCode: HttpStatus.OK,
                list
            }
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            }
        }
    }
    async getRecentUpdates(limit = 10) {
        try {
            const list = await this.dnsRecordModel.find()
                .sort({ updatedAt: -1 })
                .limit(limit);
            return {
                success: true,
                statusCode: HttpStatus.OK,
                list
            }
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            }
        }
    }

    async getTopIps(limit = 10) {
        try {
            const list = await this.dnsRecordModel.aggregate([
                { $match: { ip: { $ne: null } } },
                { $group: { _id: "$ip", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: limit }
            ]);
            return {
                success: true,
                statusCode: HttpStatus.OK,
                list
            }
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            }
        }
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
