import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import * as express from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { FinancialModule } from './financial/financial.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptor';


@Module({
  imports: [UserModule, PrismaModule, FinancialModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor
  }],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static('public')) // 'public' é o diretório onde seus arquivos HTML estão localizados
      .forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}
