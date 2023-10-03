import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsService } from './transactions/transactions.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService]
})
export class FinancialModule {}
