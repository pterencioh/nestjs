import { CallHandler, NestInterceptor, ExecutionContext, HttpException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";


export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler){
        try {
            const request = context.switchToHttp().getRequest();
            const token = request?.headers?.authorization?.split('Bearer ')[1];
            const user = jwt.decode(token)
    
            request.user = user;
            return handler.handle();
        } catch (error) {
            throw new HttpException("Invalid JWT Token", 400);
        }

    }
}