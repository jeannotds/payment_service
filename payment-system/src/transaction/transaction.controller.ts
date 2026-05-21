import {
  Body,
  Controller,
  Get,
  ParseEnumPipe,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from 'src/dto/transaction.dto';
import { AuthGuard } from 'src/auth/guards/jwt/jwt.guard';
import { TransferDto } from 'src/dto/transfer.dto';
import { TransactionType } from 'generated/prisma/enums';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @Post('deposit')
  async deposit(
    @Req() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.deposit({
      userId: req.user.sub as string,
      amount: createTransactionDto.amount,
    });
  }

  @UseGuards(AuthGuard)
  @Post('withdraw')
  async withDraw(
    @Req() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.withDraw({
      userId: req.user.sub as string,
      amount: createTransactionDto.amount,
    });
  }

  @UseGuards(AuthGuard)
  @Post('transfer')
  async transfer(@Req() req, @Body() transferDto: TransferDto) {
    return this.transactionService.transfer(
      req.user.sub as string,
      transferDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async getTransactions(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query(
      'type',
      new ParseEnumPipe(TransactionType, { optional: true }),
    )
    type?: TransactionType,
  ) {
    return this.transactionService.getTransactions(
      req.user.sub as string,
      Number(page),
      Number(limit),
      type,
    );
  }
}
