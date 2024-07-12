import { Injectable } from '@nestjs/common';
import { Reservation } from '../entities/reservation';
import { ReservationRepository } from '../repositories/reservation.repository';
import { CreateReservationDto } from '../../../api/concerts/dto/create-reservation-date.dto';

@Injectable()
export class ReservationService {
  constructor(private repository: ReservationRepository) {}

  async getAvailableDates(): Promise<string[]> {
    return this.repository.findAvailableDates();
  }

  async getAvailableSeats(date: string): Promise<number[]> {
    return this.repository.findAvailableSeats(date);
  }

  async createReservation(createReservationDto:CreateReservationDto): Promise<Reservation> {
    const reservation = new Reservation(
      undefined,
      new Date(createReservationDto.date),
      createReservationDto.seatNumber,
      createReservationDto.userId,
      new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    );
    return this.repository.save(reservation);
  }
}
