import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { DnsAdminDocument, Role } from 'lib/db/module/admin.schema';
import { verifyJwt } from 'lib/util/jwt.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectModel('DnsAdmin') private readonly adminModel: Model<DnsAdminDocument>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        const token = request.cookies?.access_token;

        if (!token) {
            response.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'Authentication required',
            });
            return false;
        }

        try {
            const payload = verifyJwt(token);
            const admin = await this.adminModel.findById(payload.id);

            if (!admin) {
                response.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'User not found',
                });
                return false;
            }

            request.user = admin;

            if (!requiredRoles || requiredRoles.length === 0) return true;

            if (!requiredRoles.includes(admin.role)) {
                response.status(HttpStatus.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied',
                });
                return false;
            }

            return true;
        } catch {
            response.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid token',
            });
            return false;
        }
    }
}
