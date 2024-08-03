import { ReservationService } from '../../../domain/concerts/services/reservation.service';
import { UserService } from '../../../domain/user/services/user.service';
import { TicketSessionService } from '../../../domain/auth/services/ticket-session.service';
import { TokenService } from '../../../domain/auth/services/token.service';
import { Injectable } from '@nestjs/common';
import { Reservation } from '../../../domain/concerts/entities/reservation';

/**
 * 좌석 예약 요청 Use Case
 */
@Injectable()
export class SeatReservationUseCase {
  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private ticketSessionService: TicketSessionService,
    private tokenService : TokenService,
  ) {}

  /**
   * 좌석을 예약하고 예약 정보를 반환합니다.
   * @param date - 예약 날짜
   * @param seatNumber - 좌석 번호
   * @param token - 인증 토큰
   * @returns 예약 ID 및 만료 시간
   * @throws 유저 또는 좌석을 찾을 수 없는 경우 에러 발생
   */
  async reserveSeat(date: string, seatNumber: number, token: string): Promise<{ reservation: Reservation; expiresIn: string }> {
    const decodedToken = this.tokenService.verifyToken(token);
    const user = await this.userService.findById(decodedToken.userId);
    const reservation = await this.reservationService.createReservation({ userId:user.id, date:date, seatNumber:seatNumber, token:token });
    const ticketSession = await this.ticketSessionService.addSession(user.id)
    return {
      reservation: reservation,
      expiresIn: ticketSession.paymentDueAt.getMinutes().toString()+'minutes'
    };
  }
}
