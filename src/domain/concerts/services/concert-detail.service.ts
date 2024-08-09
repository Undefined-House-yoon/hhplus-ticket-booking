import { Injectable } from '@nestjs/common';
import { ConcertDetail } from '../entities/concert-detail';
import { ConcertDetailRepository } from '../repositories/concert-detail.repository';
import { Seat } from '../entities/seat';

@Injectable()
export class ConcertDetailService {

  constructor(private concertDetailRepository: ConcertDetailRepository) {
  }

  /*예약 가능한 날짜*/
  async getAllUpcomingConcertsByDate(): Promise<ConcertDetail[]> {
    return this.concertDetailRepository.findAvailableDates();
  }

  async getAvailableSeats(concertDetailId:number): Promise<Seat[]> {
    return this.concertDetailRepository.findAvailableSeats(concertDetailId);
  }
}
