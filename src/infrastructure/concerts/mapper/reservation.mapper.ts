import { Reservation, ReservationStatus } from '../../../domain/concerts/entities/reservation';

export class ReservationMapper {
  static toDomain(prismaReservation: any): Reservation {
    return Reservation.create({
      id: prismaReservation.id,
      userId: prismaReservation.user_id,
      seatNumber: prismaReservation.seat.seat_number,
      concertDate: prismaReservation.concertDetail.date,
      status: prismaReservation.status as ReservationStatus,
      expiresAt: prismaReservation.expires_at,
      seatId: prismaReservation.seat_id,
      concertDetailId: prismaReservation.concert_detail_id
    });
  }

  static fromDomain(reservation: Reservation): any {
    return {
      id: reservation.id,
      user_id: reservation.userId,
      concert_detail_id: reservation.concertDetailId,
      seat_id: reservation.seatId,
      status: reservation.status,
      expires_at: reservation.expiresAt
    };
  }

  static toDomainList(prismaReservations: any[]): Reservation[] {
    return prismaReservations.map(this.toDomain);
  }
}
