import { Module } from '@nestjs/common';
import { ConcertController } from '../../mock.controller';
import { ReservationUseCase } from '../../application/concerts/use-cases/reservation.use-case';
import { ReservationService } from '../../domain/concerts/services/reservation.service';
import { ReservationRepositoryImpl } from '../../infrastructure/concerts/repositories/reservation-repository.impl';
import { ReservationRepository } from '../../domain/concerts/repositories/reservation.repository';

@Module({
  imports: [],
  controllers: [ConcertController],
  providers: [ReservationUseCase, ReservationService,
    {
      provide: ReservationRepository,
      useClass: ReservationRepositoryImpl,
    },
  ],
})
export class ConcertModule {
}
