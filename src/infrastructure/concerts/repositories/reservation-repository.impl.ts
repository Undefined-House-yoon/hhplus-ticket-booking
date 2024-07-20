import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../../domain/concerts/repositories/reservation.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ReservationMapper } from '../mapper/reservation.mapper';
import { Reservation, ReservationStatus } from '../../../domain/concerts/entities/reservation';

@Injectable()
export class ReservationRepositoryImpl implements ReservationRepository {

  constructor(private prisma: PrismaService) {
  }

  async findAvailableDates(): Promise<Date[]> {
    const dates = await this.prisma.concertDetail.findMany({
      where: {
        date: { gte: new Date() },
        seats: { some: { status: 'AVAILABLE' } },
      },
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'asc' },
    });
    return dates.map(d => d.date);
  }

  async findAvailableSeats(concertDetailId: number): Promise<number[]> {
    const seats = await this.prisma.seat.findMany({
      where: {
        concert_detail_id: concertDetailId,
        status: 'AVAILABLE',
      },
      select: { seat_number: true },
    });
    return seats.map(s => s.seat_number);
  }

  async save(reservation: Reservation): Promise<Reservation> {
    const saved = await this.prisma.reservation.upsert({
      where: { id: reservation.id || 0 },
      update: {
        user_id: reservation.userId,
        concert_detail_id: reservation.concertDetailId,
        seat_id: reservation.seatId,
        status: reservation.status,
        expires_at: reservation.expiresAt,
      },
      create: {
        user_id: reservation.userId,
        concert_detail_id: reservation.concertDetailId,
        seat_id: reservation.seatId,
        status: reservation.status,
        expires_at: reservation.expiresAt,
      },
      include: {
        seat: true,
        concertDetail: true,
      },
    });

    return ReservationMapper.toDomain(saved);
  }

  async findById(id: number): Promise<Reservation | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        seat: true,
        concertDetail: true,
      },
    });
    return reservation ?  ReservationMapper.toDomain(reservation): null;
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { user_id: userId },
      include: {
        seat: true,
        concertDetail: true,
      },
    });
    // return reservations.map(this.mapToReservation);
    return ReservationMapper.toDomainList(reservations);
  }

  async findByConcertDetailId(concertDetailId: number): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { concert_detail_id: concertDetailId },
      include: {
        seat: true,
        concertDetail: true,
      },
    });
    return ReservationMapper.toDomainList(reservations);
  }

  async findConcertDetailIdByDate(date: Date): Promise<number | null> {
    const concertDetail = await this.prisma.concertDetail.findFirst({
      where: { date },
      select: { id: true },
    });
    return concertDetail?.id || null;
  }
  // todo:SeatStatus 구현 필요
  async updateSeatStatus(seatId: number, status: "string"): Promise<void> {
    await this.prisma.seat.update({
      where: { id: seatId },
      data: { status: status.toString() },
    });
  }

  async cancelReservation(id: number): Promise<Reservation> {
    const canceled = await this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        seat: true,
        concertDetail: true,
      },
    });
    return ReservationMapper.toDomain(canceled);
  }

  async findActiveReservations(): Promise<Reservation[]> {
    const activeReservations = await this.prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        expires_at: { gt: new Date() },
      },
      include: {
        seat: true,
        concertDetail: true,
      },
    });
    return ReservationMapper.toDomainList(activeReservations);
  }

  async countReservationsByConcertDetail(concertDetailId: number): Promise<number> {
    return this.prisma.reservation.count({
      where: { concert_detail_id: concertDetailId },
    });
  }
}
