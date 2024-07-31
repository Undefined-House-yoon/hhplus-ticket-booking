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

@Module({
  imports: [BalanceModule, PrismaModule,IdentityModule,ConcertModule,AuthConfigModule,ReservationModule],
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
