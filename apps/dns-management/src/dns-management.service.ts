import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DnsAdminDocument } from "lib/db/module/admin.schema";
import { compare } from "lib/util/bcrypt.util";
import { signJwt } from "lib/util/jwt.util";
import { Model } from "mongoose";

@Injectable()
export class DnsManagementService {
    constructor(
        @InjectModel("DnsAdmin")
        private readonly adminModel: Model<DnsAdminDocument>,
    ) { }

    async login(name: string, password: string) {
        try {
            if (!name || !password) {
                return {
                    success: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Username and password required",
                }
            }
            const admin = await this.adminModel.findOne({ name });

            if (!admin) {
                return {
                    success: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "User not found",
                };
            }

            const isMatch = await compare(password, admin.password);
            if (!isMatch) {
                return {
                    success: false,
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: "Invalid password",
                };
            }

            const token = signJwt({
                id: admin._id,
                name: admin.name,
                role: admin.role,
            });

            return {
                success: true,
                statusCode: HttpStatus.OK,
                access_token: token,
            };
        } catch (err) {
            return {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            };
        }
    }
}
