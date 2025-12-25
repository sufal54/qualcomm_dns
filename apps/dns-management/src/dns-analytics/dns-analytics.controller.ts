import { Controller, Get } from '@nestjs/common';
import { DnsAnalyticsService } from './dns-analytics.service';

@Controller('dns-analytics')
export class DnsAnalyticsController {
    constructor(private readonly domainManagementService: DnsAnalyticsService) { }
    @Get('analytics')
    async getAnalytics() {
        return this.domainManagementService.getAnalytics();
    }

    @Get('total')
    async getTotal() {
        return this.domainManagementService.getTotalRecords();
    }

    @Get('blocked')
    async getBlocked() {
        return this.domainManagementService.getBlockedStats();
    }

    @Get('redirects')
    async getRedirects() {
        return this.domainManagementService.getRedirectStats();
    }

    @Get('ttl')
    async getTtlDistribution() {
        return this.domainManagementService.getTtlDistribution();
    }

    @Get('recent')
    async getRecentUpdates() {
        return this.domainManagementService.getRecentUpdates();
    }

    @Get('top-ips')
    async getTopIps() {
        return this.domainManagementService.getTopIps();
    }
}
