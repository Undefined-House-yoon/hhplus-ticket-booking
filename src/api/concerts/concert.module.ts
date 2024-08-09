import { Module } from '@nestjs/common';
import { ConcertController } from './concert.controller';
import { UserModule } from '../user/user.module';
import {
  GetAllUpcomingConcertsByDateUseCase
} from '../../application/concerts/use-cases/get-all-upcoming-concerts-by-date.use-case';
import { GetAvailableSeatsUseCase } from '../../application/concerts/use-cases/get-available-seats.use-case';
import { ConcertDetailService } from '../../domain/concerts/services/concert-detail.service';
import { ConcertDetailRepository } from '../../domain/concerts/repositories/concert-detail.repository';
import { ConcertDetailRepositoryImpl } from '../../infrastructure/concerts/repositories/concert-detail-repository.impl';
import { SeatModule } from '../seat.module';

@Module({
  imports:[UserModule,SeatModule],
  controllers: [ConcertController],
  providers: [
    GetAvailableSeatsUseCase, GetAllUpcomingConcertsByDateUseCase,
    ConcertDetailService,
    { provide: ConcertDetailRepository, useClass: ConcertDetailRepositoryImpl },
  ],
})
export class ConcertModule {}
