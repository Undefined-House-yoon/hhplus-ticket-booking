import { Injectable } from '@nestjs/common';
import { ConcertDetailService } from '../../../domain/concerts/services/concert-detail.service';


@Injectable()
export class GetAllUpcomingConcertsByDateUseCase {
  constructor (private concertDetailService:ConcertDetailService){  }

  //예약 가능한 날짜 목록 조회 dates:
  getAllUpcomingConcertsByDate = () => this.concertDetailService.getAllUpcomingConcertsByDate()
}

