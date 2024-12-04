import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { UserModule } from '../user/user.module';
import { SeatModule } from '../seat.module';
import { PaymentService } from '../../domain/balance/services/payment.service';
import { ReservationService } from '../../domain/concerts/services/reservation.service';
import { ReservationRepository } from '../../domain/concerts/repositories/reservation.repository';
import { UserRepository } from '../../domain/user/repositories/user.repository';
import { PaymentRepository } from '../../domain/balance/repositories/payment.repositoy';
import { ReservationRepositoryImpl } from '../../infrastructure/concerts/repositories/reservation-repository.impl';
import { UserRepositoryImpl } from '../../infrastructure/user/repositories/user-repository.impl';
import { PaymentRepositoryImpl } from '../../infrastructure/payment/repositories/payment-repository.impl';
import { RefundPaymentUseCase } from '../../application/balance/use-cases/refund-payment-use-case.service';
import { ReserveAndPayUseCase } from '../../application/concerts/use-cases/reserve-and-pay.usecase';

@Module({
  imports: [UserModule, SeatModule],
  controllers: [PaymentController],
  providers: [
    RefundPaymentUseCase,ReserveAndPayUseCase,
    PaymentService, ReservationService,
    { provide: ReservationRepository, useClass: ReservationRepositoryImpl },
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: PaymentRepository, useClass: PaymentRepositoryImpl },
  ],
})
export class PaymentModule {
}
