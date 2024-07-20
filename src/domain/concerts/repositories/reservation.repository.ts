import { Reservation } from '../entities/reservation';


export abstract class ReservationRepository {
  abstract findAvailableDates(): Promise<Date[]>; // string[] 대신 Date[]를 반환
  abstract findAvailableSeats(concertDetailId: number): Promise<number[]>;

  abstract save(reservation: Reservation): Promise<Reservation>;

  abstract findById(id: number): Promise<Reservation | null>;

  abstract findByUserId(userId: number): Promise<Reservation[]>;

  abstract findByConcertDetailId(concertDetailId: number): Promise<Reservation[]>;

  abstract findConcertDetailIdByDate(date: Date): Promise<number | null>; // string 대신 Date 타입 사용
  //SeatStatus todo: 구현 필요
  abstract updateSeatStatus(seatId: number, status: string): Promise<void>; // string 대신 enum 사용
  abstract cancelReservation(id: number): Promise<Reservation>;

  abstract findActiveReservations(): Promise<Reservation[]>;

  abstract countReservationsByConcertDetail(concertDetailId: number): Promise<number>;
}
