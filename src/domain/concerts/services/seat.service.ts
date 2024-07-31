import { Seat, SeatStatus } from '../entities/seat';
import { SeatRepository } from '../repositories/seat.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeatService {

  constructor(private seatRepository: SeatRepository) {}
  /**
   * 주어진 좌석을 예약합니다.
   * @param seatId 예약할 좌석의 ID
   * @returns 예약된 Seat 객체
   * @throws 좌석을 찾지 못한 경우 에러를 던집니다.
   */
  async reserveSeat(seatId: number): Promise<Seat> {
    const seat = await this.seatRepository.findById(seatId);
    if (!seat) {
      throw new Error('Seat not found');
    }
    seat.reserve();
    return this.seatRepository.updateStatus(seat);
  }
  /**
   * 주어진 좌석을 점유합니다.
   * @param seatId 점유할 좌석의 ID
   * @returns 점유된 Seat 객체
   * @throws 좌석을 찾지 못한 경우 에러를 던집니다.
   */
  async occupySeat(seatId: number): Promise<Seat> {
    const seat = await this.seatRepository.findById(seatId);
    if (!seat) {
      throw new Error('Seat not found');
    }
    seat.occupy();
    return this.seatRepository.updateStatus(seat);
  }
  /**
   * 주어진 좌석을 해제합니다.
   * @param seatId 해제할 좌석의 ID
   * @returns 해제된 Seat 객체
   * @throws 좌석을 찾지 못한 경우 에러를 던집니다.
   */
  async releaseSeat(seatId: number): Promise<Seat> {
    const seat = await this.seatRepository.findById(seatId);
    if (!seat) {
      throw new Error('Seat not found');
    }
    seat.release();
    return this.seatRepository.updateStatus(seat);
  }
  /**
   * 주어진 공연 세부 사항 ID에 해당하는 모든 이용 가능한 좌석을 가져옵니다.
   * @param concertDetailId 공연 세부 사항 ID
   * @returns 이용 가능한 Seat 객체 배열
   */
  async getAvailableSeats(concertDetailId: number): Promise<Seat[]> {
    const seats = await this.seatRepository.findByConcertDetailId(concertDetailId);
    return seats.filter(seat => seat.status === SeatStatus.AVAILABLE);
  }
}
