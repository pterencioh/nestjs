import { Body, Controller, Param, ParseIntPipe, Post, Put, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreditDto, DebitDto, DefaultUpdateDto, DeleteDto, IncomeDto, UpdateDebitIncomeDto } from '../dtos/financial.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserInfo } from 'src/user/decorators/user.decorator';

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
    @Put('/debit/:id')
    updateDebitTransaction(
        @Body() body : UpdateDebitIncomeDto,
        @Param("id", new ParseIntPipe()) id : number,
        @User() user : UserInfo){
            return user;
       /*  return this.transactionService.updateTransaction(body, id, 'debit'); */
    }

    @Put('/credit/:id')
    updateCreditTransaction(
        @Body() body : DefaultUpdateDto,
        @Param("id", new ParseIntPipe()) id : number){
        return this.transactionService.updateTransaction(body, id, 'credit');
    }

    @Put('/income/:id')
    updateIncomeTransaction(
        @Body() body : UpdateDebitIncomeDto,
        @Param("id", new ParseIntPipe()) id : number){
        return this.transactionService.updateTransaction(body, id, 'income');
    }

    //DELETE
    @Delete(':id')
    deleteTransaction(
        @Body() body : DeleteDto,
        @Param("id", new ParseIntPipe()) id : number){
            return this.transactionService.deleteTransaction(body.user_id ,id);
    }

}
