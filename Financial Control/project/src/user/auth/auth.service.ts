import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { GoogleDto, ResetDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { created_types } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

export interface SignupParams {
    name: string;
    email: string;
    password: string;
}

export interface GoogleJWT {
    name: string;
    email: string;
}

export enum GoogleTypes {
    signup = "signup",
    signin = "signin"
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) { }
    async signup({ name, email, password }: SignupDto) {

        const userExists = await this.getUser(email);
        if (userExists)
            throw new ConflictException();

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.addUser(name, email, hashedPassword, 'default');

        return { jwt: this.generateJWTtoken(user.id, name, email) };
    }

    async signin({ email, password }: SigninDto) {
        const user = await this.getUser(email);
        if (!user)
            throw new HttpException('Invalid credentials', 400);

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword)
            throw new HttpException('Invalid credentials', 400);

        await this.updateLastLogin(user.id);

        return { jwt: this.generateJWTtoken(user.id, user.name, email) };
    }

    async googleAccess(body: GoogleDto, type: GoogleTypes) {
        const decodeJWT = jwt.decode(body.jwt) as GoogleJWT;
        if (!decodeJWT)
            throw new HttpException('Invalid credentials', 400);

        return type === "signup" ? await this.googleSignup(decodeJWT) : await this.googleSignin(decodeJWT);
    }

    async googleSignup(decodeJWT: GoogleJWT) {
        const userExists = await this.getUser(decodeJWT.email);
        if (userExists)
            throw new ConflictException();

        const password = `(u_u)${decodeJWT.name}(*-*)${decodeJWT.email}(o-o)`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.addUser(decodeJWT.name, decodeJWT.email, hashedPassword, 'google');

        return { jwt: this.generateJWTtoken(user.id, decodeJWT.name, decodeJWT.email) };
    }

    async googleSignin(decodeJWT: GoogleJWT) {
        const userExists = await this.getUser(decodeJWT.email);
        if (!userExists)
            throw new HttpException('Invalid credentials', 400);

        await this.updateLastLogin(userExists.id);

        return { jwt: this.generateJWTtoken(userExists.id, decodeJWT.name, decodeJWT.email) };
    }

    private generateJWTtoken(id: number, name: string, email: string, expiresIn: number = 360000000) {
        return jwt.sign({
            id,
            name,
            email
        }, process.env.JSON_TOKEN_KEY, {
            expiresIn
        })
    }

    private verifyJWTtoken(token: string) {
        try {
            jwt.verify(token, process.env.JSON_TOKEN_KEY);
            return true;
        } catch (error) {
            return false;
        }
    }

    async getUser(email: string) {
        return this.prismaService.users.findUnique({
            where: {
                email
            }
        })
    }

    async addUser(name: string, email: string, password: string, createdBy: created_types) {
        return this.prismaService.users.create({
            data: {
                name,
                email,
                password,
                created_by: createdBy
            }
        })
    }

    async updateLastLogin(userID: number) {
        return this.prismaService.users.update({
            where: {
                id: userID
            },
            data: {
                last_login_at: new Date()
            }
        });
    }

    async resetPassword({ email } : ResetDto){
        const user = await this.getUser(email);
        if(!user)
            throw new HttpException('Invalid reset credentials', 400);

        const isTokenFilled: boolean = (user.reset_token !== null);
        const isTokenExpired: boolean = (isTokenFilled && !(this.verifyJWTtoken(user.reset_token)));

        if (isTokenFilled && isTokenExpired)
            throw new HttpException('Please request another password reset', 404);

        const userToken: string = this.generateJWTtoken(user.id, user.name, user.email, 1800);
        const addToken =  await this.prismaService.users.update({
            where: {
                id: user.id,
                email: user.email
            },
            data: {
                reset_token: userToken
            }
        });

        if(!addToken)
            throw new HttpException('It was not possible to create your reset token', 400);

        this.sendPasswordReset(user.name, user.email, userToken);
    }

    private sendPasswordReset = (username: string, recipient: string, resetKey: string) => {
        const transport = nodemailer.createTransport({
            host: process.env.HOST_MAILER,
            port: parseInt(process.env.PORT_MAILER),
            secure: true,
            auth: {
                user: process.env.EMAIL_MAILER,
                pass: process.env.PASSWORD_MAILER
            }
        });
    
        let bodyMessage = `<h2>Hello dear, ${username}</h2>`;
        bodyMessage += "<p>We have identified a request to reset your password, please click on the link below:</p>";
        bodyMessage += `<p><a href='http://localhost:8383/reset?key=${resetKey}'>Reset Password</a></p>`
        
        return transport.sendMail({
            from: "Financial Control <no.reply.login.authenticator@gmail.com>",
            to: recipient,
            subject: "Password Reset Request",
            html:  bodyMessage
        })
    }
}
