import { Module } from '@nestjs/common';
import { QueueService } from './queue/queue.service';
import { QueueController } from './queue/queue.controller';
import { BullModule } from '@nestjs/bull';
import { QueueProcessor } from './queue/queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'task-queue',
    }),
  ],
  providers: [QueueService,QueueProcessor],
  controllers: [QueueController]
})
export class QueueModule {}
