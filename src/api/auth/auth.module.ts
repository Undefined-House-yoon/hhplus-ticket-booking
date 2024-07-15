import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GetTokenUseCase } from '../../application/auth/use-cases/getToken.use-case';
import { AuthService } from '../../domain/auth/services/auth.service';
import { TokenRepository } from '../../domain/auth/repositories/token.repository';
import { TokenRepositoryImpl } from '../../infrastructure/auth/repositories/token-repository.impl';
import { QueueUseCase } from '../../application/auth/use-cases/queue.use-case';
import { QueueService } from '../../domain/auth/services/queue.service';
import { QueueScheduler } from '../../application/auth/scheduler/queue-scheduler.use-case';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [GetTokenUseCase,
    AuthService,
    QueueUseCase,
    QueueService,
    QueueScheduler,
    {
      provide: TokenRepository,
      useClass: TokenRepositoryImpl,
    },
  ],
})
export class AuthModule {
}
