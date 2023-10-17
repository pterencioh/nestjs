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

@Controller('api/installments')
export class InstallmentsController {
  constructor(private readonly installmentsService: InstallmentsService) {}

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
