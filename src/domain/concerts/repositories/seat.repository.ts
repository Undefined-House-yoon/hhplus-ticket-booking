import { Seat } from '../entities/seat';

export abstract class SeatRepository {
  abstract findById(id: number): Promise<Seat | null>;
  abstract findByConcertDetailId(concertDetailId: number): Promise<Seat[]>;
  abstract save(seat: Seat): Promise<Seat>;
}
