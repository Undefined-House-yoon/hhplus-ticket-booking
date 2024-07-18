import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNumber()
  userId: number;
  @ApiProperty()
  @IsNumber()
  amount: number;
}
