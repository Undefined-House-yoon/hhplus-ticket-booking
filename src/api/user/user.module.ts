import { Module } from '@nestjs/common';
import { UserService } from '../../domain/user/services/user.service';
import { UserRepository } from '../../domain/user/repositories/user.repository';
import { UserRepositoryImpl } from '../../infrastructure/user/repositories/user-repository.impl';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '../../application/auth/use-cases/create-user.use-case';
import { BalanceService } from '../../domain/balance/services/balance.service';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    UserService, BalanceService,
    { provide: UserRepository, useClass: UserRepositoryImpl },
  ],
  exports: [UserService,
    { provide: UserRepository, useClass: UserRepositoryImpl },
  ],
})
export class UserModule {
}
