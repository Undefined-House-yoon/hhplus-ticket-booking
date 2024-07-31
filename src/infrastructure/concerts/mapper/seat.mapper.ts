import { mapPrismaSeatToSeatStatus, Seat, SeatStatus } from '../../../domain/concerts/entities/seat';

import { Seat as PrismaSeat } from '@prisma/client';

export class SeatMapper {
  static toDomain(prismaSeat: PrismaSeat): Seat {
    return Seat.create({
      id: prismaSeat.id,
      concertDetailId: prismaSeat.concert_detail_id,
      seatNumber: prismaSeat.seat_number,
      status: mapPrismaSeatToSeatStatus(prismaSeat.status),
    });
  }

  static toDomainList = (prismaSeats: any[]): Seat[] => prismaSeats.map(this.toDomain);
}
