import { Document, Schema } from "mongoose";

export enum Role {
    ADMIN = 'admin',
    SUB_ADMIN = 'subadmin'
}

export const DnsAdmin = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true,
        default: Role.SUB_ADMIN,
    },
}, { timestamps: true })

export interface DnsAdminDocument extends Document {
    name: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}