import { Document, Schema } from "mongoose";
import * as bcrypt from "bcrypt";

export enum Role {
    ADMIN = "admin",
    SUB_ADMIN = "subadmin"
}

export const DnsAdmin = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true,
        default: Role.SUB_ADMIN,
    },
}, { timestamps: true });

DnsAdmin.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});
export interface DnsAdminDocument extends Document {
    name: string;
    role: Role;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}