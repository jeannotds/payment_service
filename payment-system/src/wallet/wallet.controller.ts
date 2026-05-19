import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from 'generated/prisma/browser';
import { AuthGuard } from 'src/auth/guards/jwt/jwt.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // CREATE WALLET
  @UseGuards(AuthGuard)
  @Get()
  async getWallet(@Req() req): Promise<Wallet> {
    return this.walletService.getWallet(req.user.sub as string);
  }
}
