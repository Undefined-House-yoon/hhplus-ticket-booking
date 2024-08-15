import { Module } from '@nestjs/common';
import { BullQueueService } from './queue/bull-queue.service';
import { QueueController } from './queue/queue.controller';
import { QueueProcessor } from './queue/queue.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'userQueue',
    }),
  ],
  providers: [BullQueueService,QueueProcessor],
  controllers: [QueueController]
})
export class QueueModule {}
