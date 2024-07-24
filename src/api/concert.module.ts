import { Module } from '@nestjs/common';
import { ReservationUseCase } from '../application/concerts/use-cases/reservation.use-case';
import { ReservationService } from '../domain/concerts/services/reservation.service';
import { ReservationRepositoryImpl } from '../infrastructure/concerts/repositories/reservation-repository.impl';
import { ReservationRepository } from '../domain/concerts/repositories/reservation.repository';
import { ReservationController } from './concerts/reservations.controller';
import { ConcertsController } from './concerts/concerts.controller';
import { UserModule } from './user.module';

@Module({
  imports:[UserModule],
  controllers: [ReservationController, ConcertsController],
  providers: [
    ReservationUseCase, ReservationService,
    { provide: ReservationRepository, useClass: ReservationRepositoryImpl },
  ],
})
export class ConcertModule {
}
