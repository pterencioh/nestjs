import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '../dtos/auth.dto';
import { created_types } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/:type/signup')
    signup(@Body() body: SignupDto, @Param('type') type : created_types){
        return this.authService.signup(body, type);
    }

    @Get('/signin')
    signin(){
        return this.authService.signin();
    }
}
