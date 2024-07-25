import { Module } from '@nestjs/common';

import { UserRepositoryImpl } from '../infrastructure/user/repositories/user-repository.impl';
import { PaymentRepositoryImpl } from '../infrastructure/payment/repositories/payment-repository.impl';
import { ReservationRepositoryImpl } from '../infrastructure/concerts/repositories/reservation-repository.impl';
import { PaymentController } from './balance/payment.controller';
import { BalanceUseCase } from '../application/balance/use-cases/balance.use-case';
import { PaymentUseCase } from '../application/balance/use-cases/payment.use-case';
import { BalanceService } from '../domain/balance/services/balance.service';
import { PaymentService } from '../domain/balance/services/payment.service';
import { PaymentRepository } from '../domain/balance/repositories/payment.repositoy';
import { ReservationRepository } from '../domain/concerts/repositories/reservation.repository';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [PaymentController],
  providers: [

    BalanceService, BalanceUseCase,
    { provide: ReservationRepository, useClass: ReservationRepositoryImpl },

    PaymentUseCase, PaymentService,
    { provide: PaymentRepository, useClass: PaymentRepositoryImpl },
  ],
  exports:[BalanceService]
})
export class BalanceModule {
}
