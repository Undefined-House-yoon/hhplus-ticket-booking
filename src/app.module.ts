import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertModule } from './api/concerts/concert.module';
import { BalanceModule } from './api/balance/balance.module';
import { IdentityModule } from './api/Identity/identityModule';
import { CombinedApiLoggerInterceptor } from './api/interceptor/interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CombinedExceptionFilter } from './api/filter/exception.filter';

@Module({
  imports: [IdentityModule, BalanceModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: CombinedApiLoggerInterceptor,
  }, {
    provide: APP_FILTER,
    useClass: CombinedExceptionFilter,
  }],
})
export class AppModule {
}
