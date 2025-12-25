import { Document, Schema } from "mongoose";

export const DnsAdmin = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, { timestamps: true })

export interface DnsAdminDocument extends Document {
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}