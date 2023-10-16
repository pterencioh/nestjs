import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreditDto,
  DebitDto,
  DefaultUpdateDto,
  IncomeDto,
  UpdateDebitIncomeDto,
} from '../dtos/financial.dto';
import { transaction_types } from '@prisma/client';
import { UserInfo } from 'src/user/decorators/user.decorator';

interface TablesID {
  userID: number;
  receiptID?: number;
  categoryID?: number;
  transactionID?: number;
}

export enum DebitIncomeType {
  debit,
  income,
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}
  async getTransactionByID(transactionID: number, userID: number) {
    const transaction = await this.prismaService.transactions.findUnique({
      where: {
        id: transactionID,
        user_id: userID,
      },
    });

    if (!transaction) throw new HttpException('Transaction not found.', 404);

    return transaction;
  }

  async getTransactions(userID: number) {
    const transactions = await this.prismaService.transactions.findMany({
      where: {
        user_id: userID,
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (!transactions) throw new HttpException('Transactions not found.', 404);

    return transactions;
  }

  async addTransaction(
    user: UserInfo,
    body: DebitDto | CreditDto | IncomeDto,
    type: transaction_types,
  ) {
    try {
      const objIDs = {
        userID: user.id,
        receiptID: body.receipt_id,
        categoryID: body.category_id,
      };

      this.validateReceipt(body.has_receipt, body.receipt_id);

      const isCredit = body instanceof CreditDto;
      if (isCredit)
        this.validateInstallments(
          body.installments_paid,
          body.total_installments,
        );

      await this.validateIDs(objIDs);

      return this.prismaService.transactions.create({
        data: {
          user_id: user.id,
          transaction_type: type,
          ...body,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateTransaction(
    user: UserInfo,
    body: UpdateDebitIncomeDto | DefaultUpdateDto,
    id: number,
    type: transaction_types,
  ) {
    try {
      const objIDs = {
        userID: user.id,
        transactionID: id,
        receiptID: body.receipt_id,
        categoryID: body.category_id,
      };

      this.validateReceipt(body.has_receipt, body.receipt_id);
      await this.validateIDs(objIDs);

      const transaction = await this.prismaService.transactions.findUnique({
        where: {
          id,
          user_id: user.id,
          transaction_type: type,
        },
      });

      if (!transaction) throw new HttpException('Transaction not found.', 404);

      return await this.prismaService.transactions.update({
        where: {
          id,
          user_id: user.id,
          transaction_type: type,
        },
        data: {
          ...body,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteTransaction(user: UserInfo, id: number) {
    try {
      const transaction = await this.prismaService.transactions.findUnique({
        where: {
          id,
          user_id: user.id,
        },
      });

      if (!transaction) throw new HttpException('Transaction not found.', 404);

      return await this.prismaService.transactions.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  private validateReceipt(hasReceipt: boolean, receiptID: number) {
    const allEmpty =
      (hasReceipt === undefined || hasReceipt === null) &&
      (receiptID === undefined || receiptID === null);

    if (allEmpty) return;

    const checkTrue = hasReceipt === true && receiptID !== null;
    const checkFalse = hasReceipt === false && receiptID === null;

    const bothCheckFalse = !checkTrue && !checkFalse;
    if (bothCheckFalse)
      throw new HttpException('Invalid receipt information', 400);
  }

  private validateInstallments(
    installmentsPaid: boolean,
    totalInstallments: number,
  ) {
    const checkPaidTrue = installmentsPaid === true && totalInstallments === 1;
    const checkPaidFalse = installmentsPaid === false && totalInstallments >= 1;

    const bothCheckFalse = !checkPaidTrue && !checkPaidFalse;

    if (bothCheckFalse)
      throw new HttpException('Invalid installments information', 400);
  }

  private async validateIDs({
    userID,
    receiptID,
    categoryID,
    transactionID,
  }: TablesID) {
    const allEmpty =
      (receiptID === undefined || receiptID === null) &&
      (categoryID === undefined || categoryID === null) &&
      (transactionID === undefined || transactionID === null);

    if (allEmpty) return;

    const isReceiptNotEmpty = receiptID !== undefined;
    const isCategoryNotEmpty = categoryID !== undefined;
    const isTransactionNotEmpty = transactionID !== undefined;

    if (isReceiptNotEmpty) {
      const receipt = await this.getReceiptByID(receiptID, userID);
      if (!receipt) throw new HttpException('Invalid receipt information', 404);
    }

    if (isCategoryNotEmpty) {
      const category = await this.getCategoryByID(categoryID, userID);
      if (!category)
        throw new HttpException('Invalid category information', 404);
    }

    if (isTransactionNotEmpty) {
      const transaction = await this.getTransactionByID(transactionID, userID);
      if (!transaction)
        throw new HttpException('Invalid transaction information', 404);
    }
  }

  private async getReceiptByID(receiptID: number, userID: number) {
    return this.prismaService.receipt.findUnique({
      where: {
        id: receiptID,
        user_id: userID,
      },
    });
  }

  private async getCategoryByID(categoryID: number, userID: number) {
    return this.prismaService.category.findUnique({
      where: {
        id: categoryID,
        user_id: userID,
      },
    });
  }
}
