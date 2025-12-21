import { Schema } from 'mongoose';

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
        default: false,
        index: true,
    },

    redirectIp: {
        type: String,
        default: null,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
