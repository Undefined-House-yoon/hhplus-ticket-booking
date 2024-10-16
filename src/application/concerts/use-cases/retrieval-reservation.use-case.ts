import { Reservation } from '../../../domain/concerts/entities/reservation';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ReservationService } from '../../../domain/concerts/services/reservation.service';

@Injectable()
export class RetrievalReservationUseCase{
  constructor(private reservationService: ReservationService){}
  /*사용자 예약 정보 가져오기*/
  async getUserReservations(userId: number): Promise<Reservation[]> {
    return this.reservationService.getUserReservations(userId);
  }

  /*사용자 예약 세부정보 확인*/
  async getReservationDetails(reservationId: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationService.getReservationDetails(reservationId);
    if (reservation.userId !== userId) {
      throw new ForbiddenException('You are not authorized to view this reservation');
    }
    return reservation;
  }
}
