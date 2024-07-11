import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GetTokenUseCase } from '../../application/auth/use-cases/getToken.use-case';
import { AuthService } from '../../domain/auth/services/auth.service';
import { TokenRepository } from '../../domain/auth/repositories/token.repository';
import { TokenRepositoryImpl } from '../../infrastructure/auth/database/repositories/token-repository.impl';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [GetTokenUseCase, AuthService,
    {
      provide: TokenRepository,
      useClass: TokenRepositoryImpl,
    },
  ],
})
export class AuthModule {
}
