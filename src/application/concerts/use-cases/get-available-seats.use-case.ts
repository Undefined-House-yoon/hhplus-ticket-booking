import { Seat } from '../../../domain/concerts/entities/seat';
import { Injectable } from '@nestjs/common';
import { SeatService } from '../../../domain/concerts/services/seat.service';

@Injectable()
export class GetAvailableSeatsUseCase {
  constructor(private seatService: SeatService) {}

  getAvailableSeats = (concertDetailId: number): Promise<Seat[]> =>
    this.seatService.getAvailableSeats(concertDetailId);
}
