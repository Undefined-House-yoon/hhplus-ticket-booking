import { SeatRepository } from '../../../domain/concerts/repositories/seat.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Seat } from '../../../domain/concerts/entities/seat';
import { SeatMapper } from '../mapper/seat.mapper';

export class SeatRepositoryImpl implements SeatRepository {
  constructor(private prisma: PrismaService) {
  }

  async findById(id: number): Promise<Seat | null> {
    const seatData = await this.prisma.seat.findUnique({ where: { id } });
    return seatData ? SeatMapper.toDomain(seatData) : null;
  }

  async findByConcertDetailId(concertDetailId: number): Promise<Seat[]> {
    const seatsData = await this.prisma.seat.findMany({ where: { concert_detail_id: concertDetailId } });
    return SeatMapper.toDomainList(seatsData);
  }

  async save(seat: Seat): Promise<Seat> {
    const updatedSeatData = await this.prisma.seat.update({
      where: { id: seat.id },
      data: {
        status: seat.status,
      },
    });
    return SeatMapper.toDomain(updatedSeatData);
  }
}
