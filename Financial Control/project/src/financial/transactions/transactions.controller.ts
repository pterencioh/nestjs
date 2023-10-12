import { Body, Controller, Param, ParseIntPipe, Post, Put, Delete, HttpException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreditDto, DebitDto, DefaultUpdateDto, IncomeDto, UpdateDebitIncomeDto } from '../dtos/financial.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserInfo } from 'src/user/decorators/user.decorator';
import { transaction_types } from '@prisma/client';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    //CREATE
    @Post('/debit')
    addDebitTransaction(
        @User() user : UserInfo,
        @Body() body : DebitDto){
        return this.transactionService.addTransaction(user, body, transaction_types.debit);
    }

    @Post('/credit')
    addCreditTransaction(
        @User() user : UserInfo,
        @Body() body : CreditDto){
        return this.transactionService.addTransaction(user, body, transaction_types.credit);
    }

    @Post('/income')
    addIncomeTransaction(
        @User() user : UserInfo,
        @Body() body : IncomeDto){
        return this.transactionService.addTransaction(user, body, transaction_types.income);
    }


    //UPDATE
    @Put('/debit/:id')
    updateDebitTransaction(
        @User() user : UserInfo,
        @Body() body : UpdateDebitIncomeDto,
        @Param("id", new ParseIntPipe()) transactionID : number){
        const isBodyEmpty = (!body || JSON.stringify(body) === "{}");
        if (isBodyEmpty)
            throw new HttpException("Missing and/or wrong body informationMissing and/or wrong body information", 422);

        return this.transactionService.updateTransaction(user, body, transactionID, transaction_types.debit);
    }

    @Put('/credit/:id')
    updateCreditTransaction(
        @User() user : UserInfo,
        @Body() body : DefaultUpdateDto,
        @Param("id", new ParseIntPipe()) transactionID : number){
        const isBodyEmpty = (!body || JSON.stringify(body) === "{}");
        if (isBodyEmpty)
            throw new HttpException("MMissing and/or wrong body information", 422);
        return this.transactionService.updateTransaction(user, body, transactionID, transaction_types.credit);
    }

    @Put('/income/:id')
    updateIncomeTransaction(
        @User() user : UserInfo,
        @Body() body : UpdateDebitIncomeDto,
        @Param("id", new ParseIntPipe()) transactionID : number){
        const isBodyEmpty = (!body || JSON.stringify(body) === "{}");
        if (isBodyEmpty)
            throw new HttpException("Missing and/or wrong body information", 422);
        return this.transactionService.updateTransaction(user, body, transactionID, transaction_types.income);
    }

    //DELETE
    @Delete(':id')
    deleteTransaction(
        @User() user : UserInfo,
        @Param("id", new ParseIntPipe()) transactionID : number){
            return this.transactionService.deleteTransaction(user, transactionID);
    }

}
