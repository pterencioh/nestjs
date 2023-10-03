import { Injectable } from '@nestjs/common';
import { transaction_types } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { transactionDto } from '../dtos/financial.dto';

@Injectable()
export class TransactionsService {
    constructor (private readonly prismaService: PrismaService) { }
    addTransaction(body: transactionDto, type : transaction_types){
        return body ;
    }
}
