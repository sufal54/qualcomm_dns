import { Schema, Document } from 'mongoose';

export const DnsRecordSchema = new Schema({
    domain: {
        type: String,
        unique: true,
        index: true,
        required: true,
    },

    ip: {
        type: String,
        default: null,
    },

    ttl: {
        type: Number,
        default: 300,
    },

    blocked: {
        type: Boolean,
        default: false
    },

    redirectIp: {
        type: String,
        default: null,
    }
}, { timestamps: true });


export interface DnsRecordDocument extends Document {
    domain: string;
    ip: string | null;
    ttl: number;
    blocked: boolean;
    redirectIp: string | null;
    createdAt: Date;
    updatedAt: Date;
}