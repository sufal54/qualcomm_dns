import * as jwt from "jsonwebtoken";
import { Role } from "lib/db/module/admin.schema";

export interface JwtUserPayload {
    id: string;
    name: string;
    role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export function signJwt(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyJwt(token: string): JwtUserPayload {
    return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
}
