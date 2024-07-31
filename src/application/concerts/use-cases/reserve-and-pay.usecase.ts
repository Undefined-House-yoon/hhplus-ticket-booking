import { Injectable } from '@nestjs/common';
import { Reservation, ReservationStatus } from '../../../domain/concerts/entities/reservation';
import { SeatService } from '../../../domain/concerts/services/seat.service';
import { ReservationService } from '../../../domain/concerts/services/reservation.service';
import { PaymentService } from '../../../domain/balance/services/payment.service';
import { Payment, PaymentStatus } from '../../../domain/balance/entities/payment';
import { ProcessPaymentDto } from '../../../api/balance/dto/payment.dto';

@Injectable()
export class ReserveAndPayUseCase {
  constructor(
    private readonly seatService: SeatService,
    private readonly reservationService: ReservationService,
    private readonly paymentService: PaymentService,
  ) {
  }

  async reserveAndPay(processPaymentDto: ProcessPaymentDto): Promise<{
    reservation: Reservation,
    payment: Payment
  }> {
    const { reservationId, userId, amount } = processPaymentDto;

    // 1. 예약 정보 조회
    const reservation = await this.reservationService.getReservationDetails(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new Error('Reservation is not in pending status');
    }

    // 2. 결제 처리
    const paymentResult = await this.paymentService.processPayment(processPaymentDto);
    if (paymentResult.status !== PaymentStatus.Success) {
      throw new Error('Payment failed: ' + "paymentResult.message");
    }

    // 3. 좌석 상태 변경 (예약 -> 점유)
    await this.seatService.occupySeat(reservation.seatId);

    // 4. 예약 상태 변경 (대기 -> 확정)
    await this.reservationService.confirmReservation(reservationId);
    return { reservation, payment: paymentResult };
  }

}
