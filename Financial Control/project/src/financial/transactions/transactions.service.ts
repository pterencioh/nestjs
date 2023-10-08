import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DebitDto } from '../dtos/financial.dto';



@Injectable()
export class TransactionsService {
    constructor(private readonly prismaService: PrismaService) { }
    async addDebitTransaction(body: DebitDto) {
        this.validateReceipt(body.has_receipt, body.receipt_id);

        const debitTransaction = await this.prismaService.transactions.create({
            data: {
                ...body,
                transaction_type: 'debit'
            }
        })

        return debitTransaction;
    }

    validateReceipt( hasReceipt : boolean, receiptID : number ) {      
        const checkTrue = (hasReceipt === true && receiptID !== null);
        const checkFalse = (hasReceipt === false && receiptID === null);

        const bothCheckFalse = (!checkTrue && !checkFalse);
        if (bothCheckFalse)   
            throw new HttpException('Invalid receipt information', 400);
    }


}
