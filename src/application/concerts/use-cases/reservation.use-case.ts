import { ForbiddenException, Injectable } from '@nestjs/common';
import { ReservationService } from '../../../domain/concerts/services/reservation.service';
import { Reservation, ReservationStatus } from '../../../domain/concerts/entities/reservation';
import { CreateReservationDto } from '../../../api/concerts/dto/create-reservation-date.dto';
import { SeatService } from '../../../domain/concerts/services/seat.service';
import { SeatStatus } from '../../../domain/concerts/entities/seat';


@Injectable()
export class ReservationUseCase {
  constructor(
    private reservationService: ReservationService,
    private seatService: SeatService,
    ) {
  }

  /*예약 생성 이때 좌석도 상태 바꿔야해*/
  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {

    // 1. 좌석을 예약 상태로 변경
    const seat = await this.seatService.reserveSeat(createReservationDto.seatId);
    if (!seat || seat.status !== SeatStatus.RESERVED) {
      throw new Error('Failed to reserve the seat');
    }

    // 2. 예약을 생성
    const reservation = await this.reservationService.createReservation(createReservationDto);
    if (!reservation) {
      // 예약 생성 실패 시 좌석 상태를 다시 사용 가능 상태로 변경
      await this.seatService.releaseSeat(createReservationDto.seatId);
      throw new Error('Failed to create the reservation');
    }
    return this.reservationService.createReservation(createReservationDto);
  }


  /*예약 취소*/
  async cancelReservation(reservationId: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationService.getReservationDetails(reservationId);
    if (reservation.userId !== userId) {
      throw new ForbiddenException('You are not authorized to cancel this reservation');
    }
    return this.reservationService.cancelReservation(reservationId);
  }

}
