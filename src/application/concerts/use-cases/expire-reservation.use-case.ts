import { Injectable } from '@nestjs/common';
import { ReservationService } from '../../../domain/concerts/services/reservation.service';

@Injectable()
export class ExpireReservationUseCase {
  constructor(private reservationService: ReservationService) {
  }
  //스케줄러로 예약 토큰 받은 사람들 주기적으로 토큰 만료 시켜버릴 함수
  expireReservation = () => this.reservationService.expireReservation();
}
