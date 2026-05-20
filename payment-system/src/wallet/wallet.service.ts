import { Injectable } from '@nestjs/common';
import { Wallet } from 'generated/prisma/client';
import { CreateWalletDto } from 'src/dto/wallet.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async createWallet(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const { userId } = createWalletDto;
    return this.prisma.wallet.create({ data: { userId } });
  }

  // GET USER WALLET
  async getWallet(userId: string): Promise<Wallet> {
    return this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  // INCREMENT BALANCE
  async incrementBalance(walletId: string, amount: number): Promise<Wallet> {
    return this.prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }

  async decrementBalance(walletId: string, amount: number): Promise<Wallet> {
    return this.prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: { decrement: amount },
      },
    });
  }
}
