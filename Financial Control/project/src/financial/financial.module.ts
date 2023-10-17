import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsService } from './transactions/transactions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { ReceiptService } from './receipt/receipt.service';
import { ReceiptController } from './receipt/receipt.controller';
import { InstallmentsController } from './installments/installments.controller';
import { InstallmentsService } from './installments/installments.service';

@Module({
  controllers: [TransactionsController, CategoryController, ReceiptController, InstallmentsController],
  providers: [TransactionsService, PrismaService, CategoryService, ReceiptService, InstallmentsService]
})
export class FinancialModule {}
