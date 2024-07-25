import { Module } from '@nestjs/common';
import { UserService } from '../domain/user/services/user.service';
import { UserRepository } from '../domain/user/repositories/user.repository';
import { UserRepositoryImpl } from '../infrastructure/user/repositories/user-repository.impl';

@Module({
  providers: [ UserService,
    { provide: UserRepository, useClass: UserRepositoryImpl },
  ],
  exports: [ UserService,
    { provide: UserRepository, useClass: UserRepositoryImpl }],
})
export class UserModule {
}
