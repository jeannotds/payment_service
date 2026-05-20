import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  providers: [TransactionService, PrismaService],
  controllers: [TransactionController],
  imports: [WalletModule],
})
export class TransactionModule {}
