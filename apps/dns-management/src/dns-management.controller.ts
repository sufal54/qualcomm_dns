import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DnsManagementService } from './dns-management.service';
import { AdminDto } from './dto/admin.dto';


@Controller("auth")
export class DnsManagementController {
    constructor(private readonly dnsService: DnsManagementService) { }

    @Post('login')
    async login(@Body() body: AdminDto, @Res() res: Response,
    ) {
        const { statusCode, access_token, ...response } =
            await this.dnsService.login(body.name, body.password);

        if (statusCode === 200 && access_token) {
            res.cookie('access_token', access_token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
        }

        return res.status(statusCode).json(response);
    }

    @Post('logout')
    logout(@Res() res: Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    }
}
