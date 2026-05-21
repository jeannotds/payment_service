import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';
export class TransferDto {
  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;
}
