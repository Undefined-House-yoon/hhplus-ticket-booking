import { Module } from '@nestjs/common';
import { ReservationUseCase } from '../../application/concerts/use-cases/reservation.use-case';
import { ReservationService } from '../../domain/concerts/services/reservation.service';
import { ReservationRepositoryImpl } from '../../infrastructure/concerts/repositories/reservation-repository.impl';
import { ReservationRepository } from '../../domain/concerts/repositories/reservation.repository';
import { ReservationController } from './concert.controller';

@Module({
  imports: [],
  controllers: [ReservationController],
  providers: [ReservationUseCase, ReservationService,
    {
      provide: ReservationRepository,
      useClass: ReservationRepositoryImpl,
    },
  ],
  exports: [ReservationRepository],
})
export class ConcertModule {
}
