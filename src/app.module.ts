import { Module } from '@nestjs/common';
import { BalanceModule } from './api/balance.module';
import { IdentityModule } from './api/identityModule';
import { CombinedApiLoggerInterceptor } from './api/middlewares/interceptor/interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CombinedExceptionFilter } from './api/middlewares/filter/exception.filter';
import { ConcertModule } from './api/concert.module';
import { PrismaModule } from './api/prisma.module';
import { AuthConfigModule } from './api/auth-config.module';
import { ReservationModule } from './api/reservation.module';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [ BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }),BullModule.registerQueue({
    name: 'task-queue',
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  }),BalanceModule, PrismaModule,IdentityModule,ConcertModule,AuthConfigModule,ReservationModule, QueueModule],
  providers: [ {
    provide: APP_INTERCEPTOR,
    useClass: CombinedApiLoggerInterceptor,
  }, {
    provide: APP_FILTER,
    useClass: CombinedExceptionFilter,
  }],
})
export class AppModule {
}
