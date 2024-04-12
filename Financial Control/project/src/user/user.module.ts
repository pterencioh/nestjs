import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfilesService } from './profiles/profiles.service';
import { ProfilesController } from './profiles/profiles.controller';



@Module({
  controllers: [AuthController, ProfilesController],
  providers: [AuthService, ProfilesService],
  imports: [PrismaModule]
})
export class UserModule {}
