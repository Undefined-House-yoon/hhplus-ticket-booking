import { IsNumber, } from 'class-validator';

export class CreateTokenDto {
  @IsNumber()
  userId: number;
}
