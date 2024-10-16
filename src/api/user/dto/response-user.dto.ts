import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ResponseUserDto{
  constructor({id,balance}){
    this.userId = id;
    this.amount = balance;
  }
  @ApiProperty({
    description: 'The unique identifier for the user',
    example: 1,
  })
  @IsNumber()
  userId: number;
  @ApiProperty({
    description: 'The amount of the user account',
    example: 100,
  })
  @IsNumber()
  amount: number;
}
