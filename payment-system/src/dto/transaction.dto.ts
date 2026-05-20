import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1) // Interdit les montants négatifs ou nuls
  amount: number;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  userId: string;
}
