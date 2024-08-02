import { Module } from '@nestjs/common';
import { BalanceModule } from './api/balance/balance.module';
import { CombinedApiLoggerInterceptor } from './api/middlewares/interceptor/interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CombinedExceptionFilter } from './api/middlewares/filter/exception.filter';
import { ConcertModule } from './api/concerts/concert.module';
import { PrismaModule } from './api/prisma.module';
import { AuthConfigModule } from './api/auth-config.module';
import { ReservationModule } from './api/reservation/reservation.module';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';
import { RedisCacheModule } from './api/cache.module';
import { PaymentModule } from './api/payment/payment.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [RedisCacheModule,
    BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }), BullModule.registerQueue({
    name: 'task-queue',
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  }),
    AuthModule,
    PaymentModule,
    BalanceModule,
    PrismaModule,
    ConcertModule,
    AuthConfigModule,
    ReservationModule,
    QueueModule],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: CombinedApiLoggerInterceptor,
  }, {
    provide: APP_FILTER,
    useClass: CombinedExceptionFilter,
  }],
})
export class AppModule {
}
