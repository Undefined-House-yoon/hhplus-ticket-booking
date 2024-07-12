import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { ConcertModule } from './api/concerts/concert.module';
import { BalanceModule } from './api/balance/balance.module';

@Module({
  imports: [AuthModule,BalanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
