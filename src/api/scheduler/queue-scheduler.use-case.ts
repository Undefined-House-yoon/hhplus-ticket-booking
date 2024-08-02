import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueService } from '../../domain/auth/services/queue.service';

@Injectable()
export class QueueScheduler {
  private readonly logger = new Logger(QueueScheduler.name);

  constructor(private queueService: QueueService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Cleaning up expired queue items');
    const expiredCount = await this.queueService.removeExpiredItems();
    this.logger.debug(`Removed ${expiredCount} expired queue items`);
  }
}
