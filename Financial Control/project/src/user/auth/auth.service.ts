import { Injectable } from '@nestjs/common';
import { SignupDto } from '../dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { created_types } from '@prisma/client';

export interface SignupParams {
    name: String;
    email: String;
    password: String;
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) { }
    signup(body: SignupDto, signupType : created_types) {
        return { ...body, message: "YEEEEEAAAAH" };
    }

    signin() {

    }
}
