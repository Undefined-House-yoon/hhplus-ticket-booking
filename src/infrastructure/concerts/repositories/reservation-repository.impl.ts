import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../../domain/concerts/repositories/reservation.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ReservationMapper } from '../mapper/reservation.mapper';
import { Reservation, ReservationStatus } from '../../../domain/concerts/entities/reservation';

@Injectable()
export class ReservationRepositoryImpl implements ReservationRepository {

  constructor(private prisma: PrismaService) {
  }

  async findById(id: number): Promise<Reservation | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        seat: true,
        concertDetail: true,
      },
    });
    return reservation ? ReservationMapper.toDomain(reservation) : null;
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


  async cancelReservation(reservationId: number): Promise<Reservation> {
    const canceled = await this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.CANCELLED },
      include: {
        seat: true,
        concertDetail: true,
      },
    });
    return ReservationMapper.toDomain(canceled);
  }

  async findActiveReservations(): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        status: {
          notIn: [ReservationStatus.EXPIRED, ReservationStatus.CANCELLED],
        },
      }, include: {
        seat: true,
        concertDetail: true,
      },
    });
    return ReservationMapper.toDomainList(reservations);
  }

  async countReservationsByConcertDetail(concertDetailId: number): Promise<number> {
    return this.prisma.reservation.count({
      where: { concert_detail_id: concertDetailId },
    });
  }

  async updateReservationStatus(reservations: Reservation[]): Promise<void> {
    this.prisma.reservation.updateMany({ data: reservations });
  }

  async updateReservation(reservationId: number): Promise<Reservation> {
    const updatedReservation = this.prisma.reservation.update({
      where: { id: reservationId }, data: { status : ReservationStatus.CONFIRMED},
    });
    return ReservationMapper.toDomain(updatedReservation);
  }


}
