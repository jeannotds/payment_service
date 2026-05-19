import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto, CreateSignupDto } from '../dto/auth.dto';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private walletService: WalletService,
  ) {}

  // remove password from user object
  private omitPassword<T extends { password: string }>(
    user: T,
  ): Omit<T, 'password'> {
    const copy = { ...user };
    delete (copy as { password?: string }).password;
    return copy as Omit<T, 'password'>;
  }

  async generateToken(userId: string, email: string) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
    });
  }

  async signup(createSignupDto: CreateSignupDto) {
    const { name, email, password } = createSignupDto;
    const existingEmail = await this.userService.findByEmail(email);

    // vérifier si user existe
    if (existingEmail) {
      throw new BadRequestException('Email already in use');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }
    // créer le wallet pour l'utilisateur
    await this.walletService.createWallet({ userId: user.id as string });
    const token = await this.generateToken(user.id, user.email);

    const response = {
      user: this.omitPassword(user),
      token,
      include: {
        wallet: true,
      },
    };

    return response;
  }

  // LOGIN USER
  async login(createLoginDto: CreateLoginDto) {
    const { email, password } = createLoginDto;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await this.generateToken(user.id, user.email);

    const response = {
      user: this.omitPassword(user),
      token,
    };

    return response;
  }
}
