import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/jwt/jwt.guard';
import { CreateLoginDto, CreateSignupDto } from '../dto/auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createSignupDto: CreateSignupDto) {
    return this.authService.signup(createSignupDto);
  }

  @Post('login')
  async login(@Body() createLoginDto: CreateLoginDto) {
    return this.authService.login(createLoginDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req) {
    return req.user;
  }
}
