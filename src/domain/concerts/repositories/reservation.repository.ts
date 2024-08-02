import { Reservation } from '../entities/reservation';
import { Seat } from '../entities/seat';


export abstract class ReservationRepository {

  abstract save(reservation: Reservation): Promise<Reservation>;

  abstract findActiveReservations(): Promise<Reservation[]>;

  abstract findById(reservationId: number): Promise<Reservation | null>;

  abstract findByUserId(userId: number): Promise<Reservation[]>;

  abstract cancelReservation(reservationId: number): Promise<Reservation>;

  abstract updateReservationStatus( reservations: Reservation[]): Promise<void>; // string 대신 enum 사용

  abstract updateReservation( reservationId: number): Promise<Reservation>

}
