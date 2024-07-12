import { Injectable } from '@nestjs/common';
import { Reservation } from '../../../domain/concerts/entities/reservation';
import { ReservationRepository } from '../../../domain/concerts/repositories/reservation.repository';

@Injectable()
export class ReservationRepositoryImpl implements ReservationRepository {
  private reservations: Reservation[] = [];

  async findAvailableDates(): Promise<string[]> {
    // 실제 구현에서는 DB에서 조회해야 하지만, 여기서는 하드코딩된 값을 반환합니다.
    return ['2024-07-01', '2024-07-02', '2024-07-03'];
  }

  async findAvailableSeats(date: string): Promise<number[]> {
    // 실제 구현에서는 DB에서 해당 날짜의 예약된 좌석을 제외한 나머지를 반환해야 합니다.
    const reservedSeats = this.reservations
      .filter(r => r.date.toISOString().split('T')[0] === date)
      .map(r => r.seatNumber);

    return Array.from({length: 50}, (_, i) => i + 1)
      .filter(seat => !reservedSeats.includes(seat));
  }

  async save(reservation: Reservation): Promise<Reservation> {
    if (reservation.id === undefined) {
      reservation.id = this.reservations.length + 1;
    }
    const index = this.reservations.findIndex(r => r.id === reservation.id);
    if (index !== -1) {
      this.reservations[index] = reservation;
    } else {
      this.reservations.push(reservation);
    }
    return reservation;
  }

  async findById(id: number): Promise<Reservation | null> {
    return this.reservations.find(r => r.id === id) || null;
  }
}
