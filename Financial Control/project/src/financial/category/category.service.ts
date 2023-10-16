import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto } from '../dtos/financial.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}
  async addCategory(userID: number, { name }: CategoryDto) {
    const existCategory = await this.prismaService.category.findFirst({
      where: {
        user_id: userID,
        name,
      },
    });

    if (existCategory)
      throw new HttpException('Category provided already exist.', 409);

    return await this.prismaService.category.create({
      data: {
        name,
        user_id: userID,
      },
    });
  }

  async getUserCategories(userID: number) {
    return await this.prismaService.category.findMany({
      where: {
        user_id: userID,
      },
    });
  }

  async getCategoryByID(userID: number, categoryID: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryID,
        user_id: userID,
      },
    });

    if (!category)
      throw new HttpException('Invalid category information.', 404);

    return category;
  }

  async updateCategory(
    userID: number,
    categoryID: number,
    { name }: CategoryDto,
  ) {
    const category = await this.getCategoryByID(userID, categoryID);

    return;
  }

  async deleteCategory(userID: number, categoryID: number) {
    let category = await this.getCategoryByID(userID, categoryID);

    category = await this.prismaService.category.delete({
      where: {
        id: categoryID,
        user_id: userID,
      },
    });

    if (!category)
      throw new HttpException(
        'It was not possible to delete the category.',
        409,
      );

    return 'Category successfully deleted';
  }
}
