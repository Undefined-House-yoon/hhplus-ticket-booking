import { Module } from '@nestjs/common';

import { UserRepositoryImpl } from '../../infrastructure/balance/repositories/user-repository.impl';
import { PaymentRepositoryImpl } from '../../infrastructure/balance/repositories/payment-repository.impl';
import { ReservationRepositoryImpl } from '../../infrastructure/concerts/repositories/reservation-repository.impl';
import { BalanceController } from './balance.controller';
import { PaymentController } from './payment.controller';
import { BalanceUseCase } from '../../application/balance/use-cases/balance.use-case';
import { PaymentUseCase } from '../../application/balance/use-cases/payment.use-case';
import { BalanceService } from '../../domain/balance/services/balance.service';
import { PaymentService } from '../../domain/balance/services/payment.service';
import { UserRepository } from '../../domain/balance/repositories/user.repository';
import { PaymentRepository } from '../../domain/balance/repositories/payment.repositoy';
import { ConcertModule } from '../concerts/concert.module';
import { ReservationRepository } from '../../domain/concerts/repositories/reservation.repository';
import { UserService } from '../../domain/balance/services/user.service';

@Module({
  imports: [ConcertModule],
  controllers: [BalanceController,PaymentController],
  providers: [
    BalanceUseCase,
    PaymentUseCase,
    BalanceService,
    PaymentService,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: PaymentRepository,
      useClass: PaymentRepositoryImpl,
    },
    {
      provide: ReservationRepository,
      useClass: ReservationRepositoryImpl,
    },
    UserService,{provide: UserRepository,useClass: UserRepositoryImpl}
  ],
  exports:[BalanceService]
})
export class BalanceModule {
}
