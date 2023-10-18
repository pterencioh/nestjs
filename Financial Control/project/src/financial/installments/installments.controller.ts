import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { InstallmentsService } from './installments.service';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { InstallmentsDto } from '../dtos/financial.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { user_roles } from '@prisma/client';

@Controller('api/installments')
export class InstallmentsController {
  constructor(private readonly installmentsService: InstallmentsService) {}

  @Roles(user_roles.user)
  @Get('transaction/:id')
  getTransactionInstallments(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) transactionID: number,
  ) {
    return this.installmentsService.getTransactionInstallments(
      user.id,
      transactionID,
    );
  }
  
  @Roles(user_roles.user)
  @Put(':id')
  updateInstallment(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) installmentID: number,
    @Body() body: InstallmentsDto,
  ) {
    return this.installmentsService.updateInstallment(
      user.id,
      installmentID,
      body,
    );
  }
}
