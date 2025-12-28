import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { DnsAnalyticsService } from './dns-analytics.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'lib/db/module/admin.schema';
import { Response } from 'express';

@Controller('dns-analytics')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.SUB_ADMIN)
export class DnsAnalyticsController {
    constructor(private readonly domainManagementService: DnsAnalyticsService) { }
    // @Get('analytics')
    // async getAnalytics(@Res() res: Response) {
    //     const { stat} = await this.domainManagementService.getAnalytics();
    // }

    @Get('total')
    async getTotal(@Res() res: Response) {
        const { statusCode, ...response } = await this.domainManagementService.getTotalRecords();
        return res.status(statusCode).json(response);
    }

    @Get('blocked')
    async getBlocked(@Res() res: Response) {
        const { statusCode, ...response } = await this.domainManagementService.getBlockedStats();
        return res.status(statusCode).json(response);
    }

    @Get('redirects')
    async getRedirects(@Res() res: Response) {
        const { statusCode, ...response } = await this.domainManagementService.getRedirectStats();
        return res.status(statusCode).json(response);
    }

    @Get('ttl')
    async getTtlDistribution(@Res() res: Response) {
        const { statusCode, ...response } = await this.domainManagementService.getTtlDistribution();
        return res.status(statusCode).json(response);
    }

    @Get('recent')
    async getRecentUpdates(@Res() res: Response) {
        const { statusCode, ...response } = await this.domainManagementService.getRecentUpdates();
        return res.status(statusCode).json(response);
    }

    @Get('top-ips')
    async getTopIps(@Res() res: Response) {
        const { statusCode, ...response } = await this.domainManagementService.getTopIps();
        return res.status(statusCode).json(response);
    }
}
