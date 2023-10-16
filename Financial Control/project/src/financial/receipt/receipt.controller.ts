import {
  Body,
  Controller,
  Post,
  Put,
  HttpException,
  ParseIntPipe,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { ReceiptDto, UpdateReceiptDto } from '../dtos/financial.dto';

@Controller('api/receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  //READ
  @Get()
  getUserReceipts(@User() user: UserInfo) {
    return this.receiptService.getUserReceipts(user.id);
  }

  @Get(':id')
  getReceiptByID(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.receiptService.getReceiptByID(user.id, id);
  }

  @Post()
  addReceipt(@User() user: UserInfo, @Body() body: ReceiptDto) {
    return this.receiptService.addReceipt(user.id, body);
  }

  @Put(':id')
  updateReceipt(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateReceiptDto,
  ) {
    const isBodyEmpty = !body || JSON.stringify(body) === '{}';

    if (isBodyEmpty)
      throw new HttpException('Missing and/or wrong body information', 422);

    return this.receiptService.updateReceipt(user.id, id, body);
  }

  @Delete(':id')
  deleteReceipt(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.receiptService.deleteReceipt(user.id, id);
  }
}
