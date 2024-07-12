import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty()
  reservationId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  amount: number;
}

export class PaymentResponseDto {
  @ApiProperty({ example: 'success', description: 'Status of the payment' })
  status: string;

  @ApiProperty({ example: '123456', description: 'Unique transaction ID' })
  transactionId: number;
}
