import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InstallmentsDto } from '../dtos/financial.dto';

@Injectable()
export class InstallmentsService {
  constructor(private readonly prismaService: PrismaService) {}
  async getTransactionInstallments(userID: number, transactionID: number) {
    const checkTransaction = await this.prismaService.transactions.findUnique({
      where: {
        id: transactionID,
        user_id: userID,
        transaction_type: 'credit',
      },
    });

    if (!checkTransaction)
      throw new HttpException('Invalid transaction information.', 404);

    return await this.prismaService.credit_installments.findMany({
      where: {
        transaction_id: transactionID,
        user_id: userID,
      },
      orderBy: {
        installment_number: 'asc',
      },
    });
  }

  async updateInstallment(
    userID: number,
    installmentID: number,
    body: InstallmentsDto,
  ) {
    const checkInstallment =
      await this.prismaService.credit_installments.findUnique({
        where: {
          id: installmentID,
          transaction_id: body.transaction_id,
          user_id: userID,
          paid: false,
        },
      });

    if (!checkInstallment)
      throw new HttpException('Invalid installment information.', 404);

    const checkPaidInfo =
      (body.paid === true && body.paid_at) ||
      (body.paid === false && !body.paid_at);

    if (!checkPaidInfo)
      throw new HttpException('Invalid body information.', 422);

    const checkTransaction = await this.prismaService.transactions.findUnique({
      where: {
        id: body.transaction_id,
        user_id: userID,
        transaction_type: 'credit',
        installments_paid: false,
      },
    });

    if (!checkTransaction)
      throw new HttpException('Invalid transaction information.', 404);

    return await this.prismaService.credit_installments.update({
      where: {
        id: installmentID,
        user_id: userID,
        transaction_id: body.transaction_id,
      },
      data: {
        ...body,
      },
    });
  }
}
