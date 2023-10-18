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
import { Roles } from 'src/decorators/roles.decorator';
import { user_roles } from '@prisma/client';

@Controller('api/receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Roles(user_roles.user)
  @Get()
  getUserReceipts(@User() user: UserInfo) {
    return this.receiptService.getUserReceipts(user.id);
  }

  @Roles(user_roles.user)
  @Get(':id')
  getReceiptByID(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.receiptService.getReceiptByID(user.id, id);
  }

  @Roles(user_roles.user)
  @Post()
  addReceipt(@User() user: UserInfo, @Body() body: ReceiptDto) {
    return this.receiptService.addReceipt(user.id, body);
  }

  @Roles(user_roles.user)
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
  
  @Roles(user_roles.user)
  @Delete(':id')
  deleteReceipt(
    @User() user: UserInfo,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.receiptService.deleteReceipt(user.id, id);
  }
}
