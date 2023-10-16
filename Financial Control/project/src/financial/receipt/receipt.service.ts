import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReceiptDto, UpdateReceiptDto } from '../dtos/financial.dto';

@Injectable()
export class ReceiptService {
  constructor(private readonly prismaService: PrismaService) {}
  async getUserReceipts(userID: number) {
    return await this.prismaService.receipt.findMany({
      where: {
        user_id: userID,
      },
      include: {
        transactions: {
          orderBy: {
            id: 'asc',
          },
        },
      },
    });
  }

  async getReceiptByID(userID: number, receiptID: number) {
    await this.checkReceipt(userID, receiptID);

    return this.prismaService.receipt.findUnique({
      where: {
        id: receiptID,
        user_id: userID,
      },
      include: {
        transactions: {
          orderBy: {
            id: 'asc',
          },
        },
      },
    });
  }

  async addReceipt(userID: number, body: ReceiptDto) {
    const isCategoryFilled = body.category_id;

    if (isCategoryFilled) await this.checkCategory(userID, body.category_id);

    return await this.prismaService.receipt.create({
      data: {
        ...body,
        user_id: userID,
      },
    });
  }

  async updateReceipt(
    userID: number,
    receiptID: number,
    body: UpdateReceiptDto,
  ) {
    const isCategoryFilled = body.category_id;

    if (isCategoryFilled) await this.checkCategory(userID, body.category_id);

    const receipt = await this.prismaService.receipt.findUnique({
      where: {
        id: receiptID,
        user_id: userID,
      },
    });

    if (!receipt) throw new HttpException('Invalid receipt information', 404);

    return await this.prismaService.receipt.update({
      where: {
        id: receiptID,
        user_id: userID,
      },
      data: {
        ...body,
      },
    });
  }

  async deleteReceipt(userID: number, receiptID: number) {
    await this.checkReceipt(userID, receiptID);

    const receipt = await this.prismaService.receipt.delete({
      where: {
        id: receiptID,
        user_id: userID,
      },
    });

    if (!receipt)
      throw new HttpException(
        'It was not possible to delete the receipt.',
        409,
      );

    return 'Receipt successfully deleted';
  }

  private async checkReceipt(userID: number, receiptID: number) {
    const receipt = await this.prismaService.receipt.findUnique({
      where: {
        id: receiptID,
        user_id: userID,
      },
    });

    if (!receipt) throw new HttpException('Invalid receipt information', 404);

    return;
  }

  private async checkCategory(userID: number, categoryID: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryID,
        user_id: userID,
      },
    });

    if (!category) throw new HttpException('Invalid category information', 404);

    return;
  }
}
