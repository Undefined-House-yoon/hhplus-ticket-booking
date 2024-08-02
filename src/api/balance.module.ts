import { Module } from '@nestjs/common';

import { PaymentRepositoryImpl } from '../infrastructure/payment/repositories/payment-repository.impl';
import { ReservationRepositoryImpl } from '../infrastructure/concerts/repositories/reservation-repository.impl';
import { PaymentController } from './balance/payment.controller';
import { BalanceUseCase } from '../application/balance/use-cases/balance.use-case';
import { RefundPaymentUseCase } from '../application/balance/use-cases/refund-payment-use-case.service';
import { BalanceService } from '../domain/balance/services/balance.service';
import { PaymentService } from '../domain/balance/services/payment.service';
import { PaymentRepository } from '../domain/balance/repositories/payment.repositoy';
import { ReservationRepository } from '../domain/concerts/repositories/reservation.repository';
import { UserModule } from './user.module';
import { BalanceController } from './balance/balance.controller';
import { UserRepository } from '../domain/user/repositories/user.repository';
import { UserRepositoryImpl } from '../infrastructure/user/repositories/user-repository.impl';
import { ReserveAndPayUseCase } from '../application/concerts/use-cases/reserve-and-pay.usecase';
import { ReservationService } from '../domain/concerts/services/reservation.service';
import { SeatModule } from './seat.module';

@Module({
  imports: [UserModule,SeatModule],
  controllers: [PaymentController, BalanceController],
  providers: [

    BalanceUseCase, BalanceService,
    { provide: ReservationRepository, useClass: ReservationRepositoryImpl },

    ReserveAndPayUseCase, ReservationService,
    { provide: UserRepository, useClass: UserRepositoryImpl },

    RefundPaymentUseCase, PaymentService,
    { provide: PaymentRepository, useClass: PaymentRepositoryImpl },
  ],
  exports: [BalanceService],
})
export class BalanceModule {
}
