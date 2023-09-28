import { IsString, IsNotEmpty, IsEmail, MinLength } from "class-validator";

export class SignupDto {

    @IsString()
    @IsNotEmpty()
    name: String;

    @IsEmail()
    email: String;

    @IsString()
    @MinLength(5)
    password: String;
}