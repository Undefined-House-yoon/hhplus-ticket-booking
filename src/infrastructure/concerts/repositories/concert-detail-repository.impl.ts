import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ConcertDetail } from '../../../domain/concerts/entities/concert-detail';
import { ConcertDetailMapper } from '../mapper/concert-detail.mapper';
import { ConcertDetailRepository } from '../../../domain/concerts/repositories/concert-detail.repository';
import { Seat, SeatStatus } from '../../../domain/concerts/entities/seat';
import { SeatMapper } from '../mapper/seat.mapper';

@Injectable()
export class ConcertDetailRepositoryImpl implements ConcertDetailRepository {

  constructor(private prisma: PrismaService) {
  }

  async findAvailableDates(): Promise<ConcertDetail[]> {
    const concertDetails = await this.prisma.concertDetail.findMany({
      where: {
        date: { gte: new Date() },
        seats: { some: { status: 'AVAILABLE' } },
      },
      orderBy: { date: 'asc' },
    });
    return ConcertDetailMapper.toDomainList(concertDetails);
  }

  async findAvailableSeats(concertDetailId: number): Promise<Seat[]> {
    const seats = await this.prisma.seat.findMany({
      where: {
        concert_detail_id: concertDetailId,
        status: SeatStatus.AVAILABLE,
      },
      orderBy: {
        seat_number: 'asc',
      },
    });
    return SeatMapper.toDomainList(seats);
  }

  async findByConcertDetailId(concertDetailId: number): Promise<ConcertDetail> {
    const concertDetail = await this.prisma.concertDetail.findUniqueOrThrow({
      where: {
        id: concertDetailId,
      },
    });
    return ConcertDetailMapper.toDomain(concertDetail);
  }
}
