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
import { Roles } from 'src/decorators/roles.decorator';
import { user_roles } from '@prisma/client';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(user_roles.user)
  @Get()
  getUserCategories(@User() user: UserInfo) {
    return this.categoryService.getUserCategories(user.id);
  }

  @Roles(user_roles.user)
  @Get(':id')
  getCategoryByID(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.categoryService.getCategoryByID(user.id, id);
  }

  @Roles(user_roles.user)
  @Post()
  addCategory(@User() user: UserInfo, @Body() body: CategoryDto) {
    return this.categoryService.addCategory(user.id, body);
  }

  @Roles(user_roles.user)
  @Put(':id')
  updateCategory(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: CategoryDto,
  ) {
    return this.categoryService.updateCategory(user.id, id, body);
  }
  
  @Roles(user_roles.user)
  @Delete(':id')
  deleteCategory(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.categoryService.deleteCategory(user.id, id);
  }
}
