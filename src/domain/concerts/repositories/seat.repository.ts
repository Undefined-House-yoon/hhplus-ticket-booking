import { Seat } from '../entities/seat';

export abstract class SeatRepository {
  abstract findById(id: number): Promise<Seat | null>;
  abstract findByConcertDetailId(concertDetailId: number): Promise<Seat[]>;
  abstract updateStatus(seat: Seat): Promise<Seat>;
}
