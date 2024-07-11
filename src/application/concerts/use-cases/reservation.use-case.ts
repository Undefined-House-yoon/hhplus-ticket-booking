import { Injectable } from '@nestjs/common';
import { ReservationService } from '../../../domain/concerts/services/reservation.service';
import { Reservation } from '../../../domain/concerts/entities/reservation';
import { CreateReservationDto } from '../../../api/concerts/dto/create-reservation-date.dto';

@Injectable()
export class ReservationUseCase {
  constructor(private reservationService: ReservationService) {}

  async getAvailableDates(): Promise<string[]> {
    return this.reservationService.getAvailableDates();
  }

  async getAvailableSeats(date: string): Promise<number[]> {
    return this.reservationService.getAvailableSeats(date);
  }

  async createReservation(createReservationDto : CreateReservationDto): Promise<Reservation> {
    return this.reservationService.createReservation(createReservationDto);
  }
}
