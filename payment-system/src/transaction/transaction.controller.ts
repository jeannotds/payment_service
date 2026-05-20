import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from 'src/dto/transaction.dto';
import { AuthGuard } from 'src/auth/guards/jwt/jwt.guard';

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
}
