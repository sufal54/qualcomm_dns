import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class AdminDto {
    @IsString()
    @MaxLength(20)
    @IsNotEmpty({ message: "Name cannot be empty" })
    name: string;

    @IsString()
    @MaxLength(15)
    @IsNotEmpty({ message: "password cannot be empty" })
    password: string;

    @IsString()
    @MaxLength(15)
    @IsOptional()
    role: string;
}

export class DeleteAdminDto {
    @IsString()
    @MaxLength(20)
    @IsNotEmpty({ message: "Name cannot be empty" })
    name: string;

}