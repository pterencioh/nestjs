import { user_roles } from "@prisma/client";
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles : user_roles[]) => SetMetadata('roles', roles);