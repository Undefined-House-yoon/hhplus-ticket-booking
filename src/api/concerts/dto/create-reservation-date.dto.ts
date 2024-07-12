import { IsDateString, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsNumber()
  seatNumber: number;

  @ApiProperty()
  @IsString()
  token: string;
}
