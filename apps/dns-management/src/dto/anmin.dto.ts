import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AdminDto {
    @IsString()
    @MaxLength(15)
    @IsNotEmpty({ message: "Name cannot be empty" })
    name: string;

    @IsString()
    @MaxLength(15)
    @IsNotEmpty({ message: "Role cannot be empty" })
    role: string;
}