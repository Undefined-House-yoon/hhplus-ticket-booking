import { IsNumber, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty()
  @IsNumber()
  userId: number;
}
