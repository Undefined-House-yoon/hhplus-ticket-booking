import { Reservation } from '../entities/reservation';

export abstract class ReservationRepository {
  abstract findAvailableDates(): Promise<string[]>;
  abstract findAvailableSeats(date: string): Promise<number[]>;
  abstract save(reservation: Reservation): Promise<Reservation>;
  abstract findById(id: number): Promise<Reservation | null>;
}
