import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { BalanceModule } from '../balance/balance.module';
import { QueueScheduler } from '../scheduler/queue-scheduler.use-case';
import { QueueUseCase } from '../../application/auth/use-cases/queue.use-case';
import { QueueService } from '../../domain/auth/services/queue.service';
import { QueueItemRepository } from '../../domain/auth/repositories/queue-item.repository';
import { QueueItemRepositoryImpl } from '../../infrastructure/auth/repositories/queue-item-repository.impl';
import { TicketSessionUseCase } from '../../application/auth/use-cases/ticket-session.use-case';
import { TicketSessionService } from '../../domain/auth/services/ticket-session.service';
import { TicketSessionRepository } from '../../domain/auth/repositories/ticket-session.repository';
import { TicketSessionRepositoryImpl } from '../../infrastructure/auth/repositories/ticket-session-repository.impl';
import { GetTokenUseCase } from '../../application/auth/use-cases/getToken.use-case';
import { TokenService } from '../../domain/auth/services/token.service';
import { TokenRepository } from '../../domain/auth/repositories/token.repository';
import { QueueTokenRepositoryImpl } from '../../infrastructure/auth/repositories/token-repository.impl';
import { AuthController } from './auth.controller';

@Module({
  imports:[UserModule,BalanceModule],
  controllers:[AuthController],
  providers: [
    QueueScheduler,
    QueueUseCase, QueueService,
    { provide: QueueItemRepository, useClass: QueueItemRepositoryImpl },

    TicketSessionUseCase, TicketSessionService,
    { provide: TicketSessionRepository, useClass: TicketSessionRepositoryImpl },

    GetTokenUseCase, TokenService,
    { provide: TokenRepository, useClass: QueueTokenRepositoryImpl },
  ],
})
export class AuthModule {
}
