import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionStatus, TransactionType } from 'generated/prisma/enums';
import { CreateTransactionDto } from 'src/dto/transaction.dto';
import { TransferDto } from 'src/dto/transfer.dto';
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

  async transfer(userId: string, transferDto: TransferDto) {
    const { receiverEmail, amount } = transferDto;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    return this.prisma.$transaction(async (tx) => {
      // sender wallet
      const senderWallet = await tx.wallet.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!senderWallet) {
        throw new NotFoundException('Sender wallet not found');
      }

      if (senderWallet.balance.toNumber() < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // 2. Receiver user + wallet
      const receiverUser = await tx.user.findUnique({
        where: {
          email: receiverEmail,
        },
        include: {
          wallet: true,
        },
      });

      if (!receiverUser || !receiverUser.wallet) {
        throw new NotFoundException('Receiver wallet not found');
      }

      // 3. Prevent self-transfer
      if (senderWallet.userId === receiverUser.id) {
        throw new BadRequestException('You cannot transfer money to yourself');
      }

      // 4. Debit sender wallet // Update sender wallet balance
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: {
          balance: {
            decrement: amount,
          },
        },
        // data: { balance: senderWallet.balance.toNumber() - amount },
      });

      // 5. Credit receiver wallet
      await tx.wallet.update({
        where: { id: receiverUser.wallet.id },
        data: {
          balance: {
            increment: amount,
          },
        },
        // data: { balance: receiverUser.wallet.balance.toNumber() + amount },
      });
    });
  }
}
