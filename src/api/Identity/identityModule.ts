import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GetTokenUseCase } from '../../application/auth/use-cases/getToken.use-case';
import { AuthService } from '../../domain/auth/services/auth.service';
import { TokenRepository } from '../../domain/auth/repositories/token.repository';
import { TokenRepositoryImpl } from '../../infrastructure/auth/repositories/token-repository.impl';
import { QueueUseCase } from '../../application/auth/use-cases/queue.use-case';
import { QueueService } from '../../domain/auth/services/queue.service';
import { QueueScheduler } from '../scheduler/queue-scheduler.use-case';
import { TicketSessionUseCase } from '../../application/auth/use-cases/ticket-session.use-case';
import { TicketSessionService } from '../../domain/auth/services/ticket-session.service';
import { UserService } from '../../domain/user/services/user.service';
import { UserRepository } from '../../domain/user/repositories/user.repository';
import { UserRepositoryImpl } from '../../infrastructure/user/repositories/user-repository.impl';
import { UserController } from './user.controller';
import { UserUseCase } from '../../application/auth/use-cases/user.use-case';
import { ConcertModule } from '../concerts/concert.module';
import { BalanceModule } from '../balance/balance.module';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  imports: [ConcertModule, BalanceModule],
  controllers: [AuthController, UserController],
  providers: [
    QueueUseCase,
    QueueService,
    QueueScheduler,

    TicketSessionUseCase,
    TicketSessionService,

    GetTokenUseCase,
    AuthService,
    {
      provide: TokenRepository,
      useClass: TokenRepositoryImpl,
    },

    UserUseCase,
    UserService,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },

    PrismaService,
  ],
})
export class IdentityModule {
}
