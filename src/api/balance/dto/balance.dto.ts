import { ApiProperty } from '@nestjs/swagger';

export class ChargeBalanceDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  amount: number;
}

export class GetBalanceDto {
  @ApiProperty()
  userId: string;
}

export class BalanceResponseDto {
  @ApiProperty()
  balance: number;
}
