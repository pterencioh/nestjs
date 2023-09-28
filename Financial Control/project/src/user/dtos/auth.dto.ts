import { IsString, IsNotEmpty, IsEmail, MinLength } from "class-validator";

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    password: string;
}

export class SigninDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class GoogleDto {
    @IsString()
    @IsNotEmpty()
    jwt: string;
}