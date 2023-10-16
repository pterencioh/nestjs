import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsService } from './transactions/transactions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { ReceiptService } from './receipt/receipt.service';
import { ReceiptController } from './receipt/receipt.controller';

@Module({
  controllers: [TransactionsController, CategoryController, ReceiptController],
  providers: [TransactionsService, PrismaService, CategoryService, ReceiptService]
})
export class FinancialModule {}
