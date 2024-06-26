import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { JWTDto, PasswordDto, ResetDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { created_types } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { JWTPayload } from 'src/guards/auth.guard';

export interface SignupParams {
    name: string;
    email: string;
    password: string;
}

export interface GoogleJWT {
    name: string;
    email: string;
    picture: string;
}

export enum GoogleTypes {
    signup = "signup",
    signin = "signin"
}

@Injectable()
export class AuthService {
    private readonly default_images: { [key: string]: string }[];
    constructor(private readonly prismaService: PrismaService) { 
        this.default_images = JSON.parse(process.env.DEFAULT_PROFILE_IMAGES)
    }

    async signup({ name, email, password }: SignupDto) {

        const userExists = await this.getUser(email);
        if (userExists)
            throw new ConflictException();

        const hashedPassword = await bcrypt.hash(password, 10);
        const profileImage = await this.generateDefaultProfileImage();

        const user = await this.addUser(name, email, hashedPassword, profileImage, 'default');

        return { jwt: this.generateJWTtoken(user.id, name, email, profileImage) };
    }

    async generateDefaultProfileImage(){
        const randomNumber: number = Math.floor(Math.random() * 10);
        const randomProfileImage: string = "user_profile" + randomNumber;
        const getImageLink = this.default_images.filter((image) => image.hasOwnProperty(randomProfileImage))[0];

        const profileImage: string = `https://drive.google.com/thumbnail?id=${getImageLink[randomProfileImage]}`;

        return profileImage;    
    }

    async signin({ email, password }: SigninDto) {
        const user = await this.getUser(email);
        if (!user)
            throw new HttpException('Invalid credentials', 400);

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword)
            throw new HttpException('Invalid credentials', 400);

        const hasResetToken = (user.reset_token !== null);
        if(hasResetToken)
            await this.clearResetToken(user.id, user.email);

        await this.updateLastLogin(user.id);

        return { jwt: this.generateJWTtoken(user.id, user.name, email, user.profile_image) };
    }

    async googleAccess(body:JWTDto, type: GoogleTypes) {
        const decodeJWT = jwt.decode(body.jwt) as GoogleJWT;
        console.log(jwt.decode(body.jwt))
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

        const user = await this.addUser(decodeJWT.name, decodeJWT.email, hashedPassword, decodeJWT.picture, 'google');

        return { answer: true, jwt: this.generateJWTtoken(user.id, decodeJWT.name, decodeJWT.email, decodeJWT.picture) };
    }

    async googleSignin(decodeJWT: GoogleJWT) {
        const userExists = await this.getUser(decodeJWT.email);
        if (!userExists)
            throw new HttpException('Invalid credentials', 400);
        
        const hasResetToken = (userExists.reset_token !== null);
        if(hasResetToken)
            await this.clearResetToken(userExists.id, userExists.email);

        await this.updateLastLogin(userExists.id);

        return { answer: true, jwt: this.generateJWTtoken(userExists.id, decodeJWT.name, decodeJWT.email, userExists.profile_image) };
    }

    async setNewPassword({ jwt: userJWT, password } : PasswordDto){
        const isValidJWT: boolean = this.verifyJWTtoken(userJWT);
        if (!isValidJWT)
            throw new HttpException("Invalid JWT Token", 400);

        const payload = jwt.decode(userJWT) as JWTPayload;
        if (!payload)
            throw new HttpException("Invalid JWT information", 400);

        const user = await this.getUser(payload.email);
        if (!user)
            throw new HttpException("Invalid user information", 404);

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prismaService.users.update({
            where: {
                id: user.id,
                email: user.email
            },
            data: {
                password: hashedPassword,
                reset_token: null
            }
        })

        return { answer: "Password successfully updated!" };
    }

    generateJWTtoken(id: number, name: string, email: string, profile_image: string, expiresIn: number = 360000000) {
        return jwt.sign({
            id,
            name,
            email,
            profile_image
        }, process.env.JSON_TOKEN_KEY, {
            expiresIn
        })
    }

    verifyJWTtoken(token: string) {
        try {
            jwt.verify(token, process.env.JSON_TOKEN_KEY);
            return true;
        } catch (error) {
            return false;
        }
    }

    decodeJWTtoken(token: string) {        
        try {            
            return jwt.decode(token) as JWTPayload;
        } catch (error) {
            return;
        }
    }

    private clearResetToken(userID: number, email: string) {
        return this.prismaService.users.update({
            where: {
                id: userID,
                email: email
            },
            data: {
                reset_token: null
            }
        })
    }

    async getUser(email: string) {
        return this.prismaService.users.findUnique({
            where: {
                email
            }
        })
    }

    async addUser(name: string, email: string, password: string, profile_image: string, createdBy: created_types) {
        return this.prismaService.users.create({
            data: {
                name,
                email,
                password,
                profile_image,
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
            throw new HttpException('Invalid reset credentials', 404);

        const isTokenFilled: boolean = (user.reset_token !== null);
        const isTokenExpired: boolean = (isTokenFilled && !(this.verifyJWTtoken(user.reset_token)));

        if (isTokenFilled && !isTokenExpired)
            throw new HttpException('Please check your email inbox, a request was already send to you!', 400);

        const userToken: string = this.generateJWTtoken(user.id, user.name, user.email, user.profile_image, 1800);
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

        return { statusCode: 200, message: 'The password reset request was successfully sent to your email!'}
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
        bodyMessage += `<p><a href='http://localhost:3000/newpassword.html?jwt=${resetKey}'>Reset Password</a></p>`
        
        return transport.sendMail({
            from: "Financial Control <no.reply.login.authenticator@gmail.com>",
            to: recipient,
            subject: "Password Reset Request",
            html:  bodyMessage
        })
    }
}
