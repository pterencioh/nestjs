import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  HttpException,
  Get,
  ParseEnumPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreditDto,
  DebitDto,
  DefaultUpdateDto,
  IncomeDto,
  UpdateDebitIncomeDto,
} from '../dtos/financial.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserInfo } from 'src/user/decorators/user.decorator';
import { transaction_types, user_roles } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Roles(user_roles.user)
  @Get(':id')
  getTransactionByID(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) transactionID: number,
  ) {
    return this.transactionService.getTransactionByID(transactionID, user.id);
  }

  @Roles(user_roles.user)
  @Get()
  getTransactions(@User() user: UserInfo) {
    return this.transactionService.getTransactions(user.id);
  }

  @Roles(user_roles.user)
  @Post('/debit')
  addDebitTransaction(@User() user: UserInfo, @Body() body: DebitDto) {
    return this.transactionService.addTransaction(
      user,
      body,
      transaction_types.debit,
    );
  }

  @Roles(user_roles.user)
  @Post('/credit')
  addCreditTransaction(@User() user: UserInfo, @Body() body: CreditDto) {
    return this.transactionService.addTransaction(
      user,
      body,
      transaction_types.credit,
    );
  }

  @Roles(user_roles.user)
  @Post('/income')
  addIncomeTransaction(@User() user: UserInfo, @Body() body: IncomeDto) {
    return this.transactionService.addTransaction(
      user,
      body,
      transaction_types.income,
    );
  }

  @Roles(user_roles.user)
  @Put('/debit/:id')
  updateDebitTransaction(
    @User() user: UserInfo,
    @Body() body: UpdateDebitIncomeDto,
    @Param('id', new ParseIntPipe()) transactionID: number,
  ) {
    const isBodyEmpty = !body || JSON.stringify(body) === '{}';
    if (isBodyEmpty)
      throw new HttpException('Missing and/or wrong body information', 422);

    return this.transactionService.updateTransaction(
      user,
      body,
      transactionID,
      transaction_types.debit,
    );
  }

  @Roles(user_roles.user)
  @Put('/credit/:id')
  updateCreditTransaction(
    @User() user: UserInfo,
    @Body() body: DefaultUpdateDto,
    @Param('id', new ParseIntPipe()) transactionID: number,
  ) {
    const isBodyEmpty = !body || JSON.stringify(body) === '{}';
    if (isBodyEmpty)
      throw new HttpException('MMissing and/or wrong body information', 422);
    return this.transactionService.updateTransaction(
      user,
      body,
      transactionID,
      transaction_types.credit,
    );
  }

  @Roles(user_roles.user)
  @Put('/income/:id')
  updateIncomeTransaction(
    @User() user: UserInfo,
    @Body() body: UpdateDebitIncomeDto,
    @Param('id', new ParseIntPipe()) transactionID: number,
  ) {
    const isBodyEmpty = !body || JSON.stringify(body) === '{}';
    if (isBodyEmpty)
      throw new HttpException('Missing and/or wrong body information', 422);
    return this.transactionService.updateTransaction(
      user,
      body,
      transactionID,
      transaction_types.income,
    );
  }
  
  @Roles(user_roles.user)
  @Delete(':id')
  deleteTransaction(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) transactionID: number,
  ) {
    return this.transactionService.deleteTransaction(user, transactionID);
  }
}
