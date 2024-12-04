import { QueueItem } from '../../../domain/auth/entities/queue-item';

import { QueueItem as PrismaQueueItem} from '@prisma/client';

export class QueueItemMapper {
  static toDomain(prismaQueueItem: PrismaQueueItem): QueueItem {
    return QueueItem.create({
      id: prismaQueueItem.id,
      userId: prismaQueueItem.user_id,
      processed: prismaQueueItem.processed,
      createdAt: prismaQueueItem.createdAt
    });
  }

  static fromDomain(queueItem: QueueItem): any{
    return {
      id: queueItem.id,
      user_id: queueItem.userId,
      processed: queueItem.isProcessed(),
      created_at: queueItem.createdAt
    };
  }

  static toDomainList(prismaQueueItem: any[]): QueueItem[] {
    return prismaQueueItem.map(this.toDomain);
  }
}
