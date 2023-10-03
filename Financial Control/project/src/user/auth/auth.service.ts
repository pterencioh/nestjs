import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { GoogleDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { created_types } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

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

        return this.generateJWTtoken(user.id, name, email);
    }

    async signin({ email, password }: SigninDto) {
        const user = await this.getUser(email);
        if (!user)
            throw new HttpException('Invalid credentials', 400);

        const isValidPassword = bcrypt.compare(password, user.password);
        if (!isValidPassword)
            throw new HttpException('Invalid credentials', 400);

        await this.updateLastLogin(user.id);

        return this.generateJWTtoken(user.id, user.name, email);
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

        return this.generateJWTtoken(user.id, decodeJWT.name, decodeJWT.email);
    }

    async googleSignin(decodeJWT: GoogleJWT) {
        const userExists = await this.getUser(decodeJWT.email);
        if (!userExists)
            throw new HttpException('Invalid credentials', 400);

        await this.updateLastLogin(userExists.id);

        return this.generateJWTtoken(userExists.id, decodeJWT.name, decodeJWT.email);
    }

    private generateJWTtoken(id: number, name: string, email: string) {
        return jwt.sign({
            id,
            name,
            email
        }, process.env.JSON_TOKEN_KEY, {
            expiresIn: 360000000
        })
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
}
