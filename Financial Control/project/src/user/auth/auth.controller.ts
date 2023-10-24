import { Controller, Post, Get, Body, Param, ParseEnumPipe } from '@nestjs/common';
import { AuthService, GoogleTypes } from './auth.service';
import { GoogleDto, ResetDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { created_types } from '@prisma/client';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    signup(@Body() body: SignupDto) {
        return this.authService.signup(body);

    }

    @Post('/signin')
    signin(@Body() body: SigninDto) {
        return  this.authService.signin(body);
    }

    @Post('/google/:typeAccess')
    googleAccess(
        @Body() body: GoogleDto,
        @Param('typeAccess', new ParseEnumPipe(GoogleTypes)) type: GoogleTypes) {
        return  this.authService.googleAccess(body, type);
    }

    @Post('/reset')
    resetPassword(
        @Body() body: ResetDto){
        return this.authService.resetPassword(body);
    }
}
