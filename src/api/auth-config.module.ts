import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { QueueScheduler } from './scheduler/queue-scheduler.use-case';
import { QueueFacade } from '../application/auth/use-cases/queue-facade.service';
import { QueueService } from '../domain/auth/services/queue.service';
import { QueueItemRepository } from '../domain/auth/repositories/queue-item.repository';
import { QueueItemRepositoryImpl } from '../infrastructure/auth/repositories/queue-item-repository.impl';
import { SchedulerModule } from './scheduler/scheduler.module';

@Global()
@Module({
  imports: [
    SchedulerModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, ConfigService,
    QueueScheduler,
    QueueFacade, QueueService,
    { provide: QueueItemRepository, useClass: QueueItemRepositoryImpl },
  ],
  exports: [PassportModule, JwtModule,
    QueueScheduler,
    QueueFacade, QueueService,
    { provide: QueueItemRepository, useClass: QueueItemRepositoryImpl }
  ],
})
export class AuthConfigModule {
}
