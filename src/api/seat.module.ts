import { Module } from '@nestjs/common';
import { SeatService } from '../domain/concerts/services/seat.service';
import { SeatRepository } from '../domain/concerts/repositories/seat.repository';
import { SeatRepositoryImpl } from '../infrastructure/concerts/repositories/seat-repository.impl';

@Module({
  providers: [SeatService,
    { provide: SeatRepository, useClass: SeatRepositoryImpl },
  ],
  exports: [SeatService,
    { provide: SeatRepository, useClass: SeatRepositoryImpl }],
})
export class SeatModule {
}
