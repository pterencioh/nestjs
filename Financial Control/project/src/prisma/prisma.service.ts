import { Injectable } from '@nestjs/common';
import { PrismaClient } from "@prisma/client";
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    onModuleInit() {
        this.$connect;
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
