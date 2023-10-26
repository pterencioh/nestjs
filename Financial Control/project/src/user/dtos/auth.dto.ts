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

export class JWTDto {
    @IsString()
    @IsNotEmpty()
    jwt: string;
}

export class ResetDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class PasswordDto {
    @IsString()
    @IsNotEmpty()
    jwt: string;

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password: string;
}