import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";
import { PrismaService } from "src/prisma/prisma.service";

interface JWTPayload {
    id: number,
    name: string,
    email: string,
    iat: number,
    exp: number
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (private readonly reflector: Reflector,
                 private readonly prismaService: PrismaService) {}
    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass()
        ])

        const hasRoles = roles?.length ? true : false;

        if(hasRoles){
            const request = context.switchToHttp().getRequest();
            const token = request?.headers?.authorization?.split('Bearer ')[1];

            try {
                const payload = jwt.verify(token, process.env.JSON_TOKEN_KEY) as JWTPayload;
                const user = await this.prismaService.users.findUnique({
                    where: {
                        id: payload.id,
                        email: payload.email
                    }
                })

                if(!user) return false

                const userHasRoles = (roles.includes(user.user_role));                
                if(!userHasRoles) return false;

                return true;
            } catch (error) {
                return false;
            }
        }

        return true;
    }
}