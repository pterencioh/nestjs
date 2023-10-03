import { Body, Controller, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { transaction_types } from '@prisma/client';
import { transactionDto } from '../dtos/financial.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    @Post(':type')
    addTransaction(
        @Body() body : transactionDto,
        @Param('type', new ParseEnumPipe(transaction_types)) type : transaction_types){
        return this.transactionService.addTransaction(body, type);
    }

}
