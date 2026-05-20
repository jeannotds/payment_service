import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionStatus, TransactionType } from 'generated/prisma/enums';
import { CreateTransactionDto } from 'src/dto/transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  // DEPOSIT
  async deposit(createTransactionDto: CreateTransactionDto) {
    const { amount, userId } = createTransactionDto;

    // chercher wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // update balance dans wallet
    const updateWallet = await this.walletService.incrementBalance(
      wallet.id as string,
      amount as number,
    );

    // create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        amount,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.SUCCESS,
        walletId: wallet.id,
      },
    });

    return {
      wallet: updateWallet,
      transaction,
    };
  }

  async withDraw(createTransactionDto: CreateTransactionDto) {
    const { amount, userId } = createTransactionDto;

    // chercher wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // update balance dans wallet
    const updateWallet = await this.walletService.decrementBalance(
      wallet.id as string,
      amount as number,
    );

    // create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        amount,
        type: TransactionType.WITHDRAW,
        status: TransactionStatus.SUCCESS,
        walletId: wallet.id,
      },
    });

    // return wallet and transaction for client
    return {
      wallet: updateWallet,
      transaction,
    };
  }
}
