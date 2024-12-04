import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ReservationController } from './reservations.controller';
import { ReservationUseCase } from '../../application/concerts/use-cases/reservation.use-case';
import { ReservationService } from '../../domain/concerts/services/reservation.service';
import { ReservationRepository } from '../../domain/concerts/repositories/reservation.repository';
import { ReservationRepositoryImpl } from '../../infrastructure/concerts/repositories/reservation-repository.impl';
import { RetrievalReservationUseCase } from '../../application/concerts/use-cases/retrieval-reservation.use-case';
import { SeatModule } from '../seat.module';

@Module({
  imports: [UserModule, SeatModule],
  controllers: [ReservationController],
  providers: [
    RetrievalReservationUseCase,
    ReservationUseCase,
    ReservationService,
    { provide: ReservationRepository, useClass: ReservationRepositoryImpl },
  ],
})
export class ReservationModule {
}
