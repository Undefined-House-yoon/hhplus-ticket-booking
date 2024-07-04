import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertController } from './mock.controller';

@Module({
  imports: [],
  controllers: [AppController,ConcertController],
  providers: [AppService],
})
export class AppModule {}
