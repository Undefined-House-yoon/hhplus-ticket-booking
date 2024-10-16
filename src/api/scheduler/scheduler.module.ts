import { Module } from '@nestjs/common';
import { ActivateTicketsSessionUseCase } from '../../application/auth/use-cases/activate-tickets-session.use-case';
import { TicketSessionService } from '../../domain/auth/services/ticket-session.service';
import { TicketSessionRepository } from '../../domain/auth/repositories/ticket-session.repository';
import { TicketSessionRepositoryImpl } from '../../infrastructure/auth/repositories/ticket-session-repository.impl';

@Module({
  providers:[
    ActivateTicketsSessionUseCase,
    TicketSessionService,
    {provide:TicketSessionRepository, useClass:TicketSessionRepositoryImpl}
  ],
  exports:[
    ActivateTicketsSessionUseCase,
    TicketSessionService,
    {provide:TicketSessionRepository, useClass:TicketSessionRepositoryImpl}
  ]
})
export class SchedulerModule{}
