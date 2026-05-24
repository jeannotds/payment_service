import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/jwt/jwt.guard';
import { CreateLoginDto, CreateSignupDto } from '../dto/auth.dto';
import { Throttle } from '@nestjs/throttler';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('signup')
  async signup(@Body() createSignupDto: CreateSignupDto) {
    return this.authService.signup(createSignupDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() createLoginDto: CreateLoginDto) {
    return this.authService.login(createLoginDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req) {
    return req.user;
  }
}
