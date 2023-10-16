import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { CategoryDto } from '../dtos/financial.dto';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getUserCategories(@User() user: UserInfo) {
    return this.categoryService.getUserCategories(user.id);
  }

  @Get(':id')
  getCategoryByID(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.categoryService.getCategoryByID(user.id, id);
  }

  @Post()
  addCategory(@User() user: UserInfo, @Body() body: CategoryDto) {
    return this.categoryService.addCategory(user.id, body);
  }

  @Put(':id')
  updateCategory(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: CategoryDto,
  ) {
    return this.categoryService.updateCategory(user.id, id, body);
  }

  @Delete(':id')
  deleteCategory(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.categoryService.deleteCategory(user.id, id);
  }
}
