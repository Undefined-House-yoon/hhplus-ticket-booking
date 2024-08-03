import { ForbiddenException, Injectable } from '@nestjs/common';
import { ReservationService } from '../../../domain/concerts/services/reservation.service';
import { Reservation } from '../../../domain/concerts/entities/reservation';
import { CreateReservationDto } from '../../../api/concerts/dto/create-reservation-date.dto';


@Injectable()
export class ReservationUseCase {
  constructor(private reservationService: ReservationService) {}

  async getAvailableDates(): Promise<Date[]> {
    return this.reservationService.getAvailableDates();
  }

  async getAvailableSeats(date: string): Promise<number[]> {
    return this.reservationService.getAvailableSeats(new Date(date));
  }

  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {
    return this.reservationService.createReservation(createReservationDto);
  }

  async cancelReservation(reservationId: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationService.getReservationDetails(reservationId);
    if (reservation.userId !== userId) {
      throw new ForbiddenException('You are not authorized to cancel this reservation');
    }
    return this.reservationService.cancelReservation(reservationId);
  }

  async getUserReservations(userId: number): Promise<Reservation[]> {
    return this.reservationService.getUserReservations(userId);
  }

  async getReservationDetails(reservationId: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationService.getReservationDetails(reservationId);
    if (reservation.userId !== userId) {
      throw new ForbiddenException('You are not authorized to view this reservation');
    }
    return reservation;
  }
}
