import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class RecordDto {
    @IsNotEmpty({ message: "Domain name requied" })
    @IsString({ message: "Domain must be string" })
    @MaxLength(30)
    domain: string;
    @IsNotEmpty({ message: "Ip name requied" })
    @IsString({ message: "Ip must be string" })
    @MaxLength(30)
    ip: string;
    @IsOptional()
    @IsNumber()
    ttl: number;
    @IsOptional()
    @IsBoolean()
    blocked: boolean;
    @IsOptional()
    @IsString({ message: "RedirectIp must be string" })
    @MaxLength(30)
    redirectIp: string;
}

export class UpdateRecordDto extends PartialType(RecordDto) { }