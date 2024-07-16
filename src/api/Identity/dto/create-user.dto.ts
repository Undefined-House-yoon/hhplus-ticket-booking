import { IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  amount: number;
}
