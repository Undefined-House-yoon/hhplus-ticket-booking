import { ApiProperty } from '@nestjs/swagger';

export class RefundRequestDto {
  @ApiProperty()
  reservationId: number;
  @ApiProperty()
  userId: number;
}

