import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/jwt/jwt.guard';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  // AuthGuard injecte JwtService : il doit être un provider du module
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  imports: [
    UserModule,
    WalletModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'superSecretKey123',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ??
          '7d') as SignOptions['expiresIn'],
      },
    }),
  ],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
