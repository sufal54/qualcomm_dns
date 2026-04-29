import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

import { join } from "path";


@Controller()
export class DnsManagementController {
    @Get("/")
    serveSPA(@Res() res: Response) {
        res.sendFile(join(__dirname, "out", "index.html"));
    }
}
