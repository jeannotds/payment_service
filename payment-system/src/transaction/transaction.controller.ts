import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
  Param,
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
  @ApiBearerAuth('access-token')
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
  @ApiBearerAuth('access-token')
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
  @ApiBearerAuth('access-token')
  @Post('transfer')
  async transfer(@Req() req, @Body() transferDto: TransferDto) {
    return this.transactionService.transfer(
      req.user.sub as string,
      transferDto,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Get()
  async getTransactions(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('type') type?: TransactionType,
  ) {
    return this.transactionService.getTransactions(
      req.user.sub as string,
      Number(page),
      Number(limit),
      type as TransactionType,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Get(':id')
  async getTransactionById(@Req() req, @Param('id') transactionId: string) {
    return this.transactionService.getTransactionById(
      req.user.sub as string,
      transactionId,
    );
  }
}
