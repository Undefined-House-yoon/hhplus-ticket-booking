import { ApiProperty } from '@nestjs/swagger';

export class ChargeBalanceDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  amount: number;
}


export class BalanceResponseDto {
  @ApiProperty()
  balance: number;
}
