import { ConcertDetail } from '../entities/concert-detail';
import { Seat } from '../entities/seat';

export abstract class ConcertDetailRepository{
  abstract findAvailableDates():Promise<ConcertDetail[]>;

  abstract findAvailableSeats(concertDetailId: number): Promise<Seat[]>;

  abstract findByConcertDetailId(concertDetailId: number): Promise<ConcertDetail>;
}
