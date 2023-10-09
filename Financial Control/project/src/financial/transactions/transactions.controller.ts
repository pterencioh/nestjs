import { Body, Controller, Param, ParseEnumPipe, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DebitIncomeType, TransactionsService } from './transactions.service';
import { CreditDto, DebitDto, DefaultUpdateDto, IncomeDto, UpdateDebitIncomeDto } from '../dtos/financial.dto';
import { type } from 'os';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    //CREATE
    @Post('/debit')
    addDebitTransaction(
        @Body() body : DebitDto){
        return this.transactionService.addTransaction(body,'debit');
    }

    @Post('/credit')
    addCreditTransaction(
        @Body() body : CreditDto){
        return this.transactionService.addTransaction(body,'credit');
    }

    @Post('/income')
    addIncomeTransaction(
        @Body() body : IncomeDto){
        return this.transactionService.addTransaction(body,'income');
    }


    //UPDATE
    @Put('/:type/:id')
    updateTransaction(
        @Body() body : UpdateDebitIncomeDto,
        @Param("type", new ParseEnumPipe(DebitIncomeType)) type : DebitIncomeType,
        @Param("id", new ParseIntPipe()) id : number){
        return this.transactionService.updateTransaction(body, id);
    }

    @Put('/credit/:id')
    updateCreditTransaction(
        @Body() body : DefaultUpdateDto,
        @Param("id", new ParseIntPipe()) id : number){
        return this.transactionService.updateTransaction(body, id);
    }

}
