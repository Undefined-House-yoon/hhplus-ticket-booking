import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../../../domain/concerts/entities/reservation';
import { Payment } from '../../../domain/balance/entities/payment';

export class ProcessPaymentDto {
  @ApiProperty()
  reservationId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  amount: number;
}

// export class PaymentResponseDto {
//   @ApiProperty({ example: 'success', description: 'Status of the payment' })
//   status: string;
//
//   @ApiProperty({ example: '123456', description: 'Unique transaction ID' })
//   transactionId: number;
// }

export class PaymentResponseDto {
  @ApiProperty({ example: 'success', description: 'Status of the payment' })
  reservation: Reservation;

  @ApiProperty({ example: '123456', description: 'Unique transaction ID' })
  payment: Payment;
}
