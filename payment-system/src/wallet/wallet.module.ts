import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/jwt/jwt.guard';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WalletService, AuthGuard],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
