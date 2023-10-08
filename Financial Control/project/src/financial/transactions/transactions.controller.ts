import { Body, Controller, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DebitDto } from '../dtos/financial.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    @Post('/debit')
    addDebitTransaction(
        @Body() body : DebitDto){
        return this.transactionService.addDebitTransaction(body);
    }

}
