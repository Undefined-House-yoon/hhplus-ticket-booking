import { QueueItem } from '../../../domain/auth/entities/queue-item';

export class QueueItemMapper {
  static toDomain(prismaQueueItem: any): QueueItem {
    return QueueItem.create({
      id: prismaQueueItem.id,
      userId: prismaQueueItem.user_id,
      processed: prismaQueueItem.processed,
      createdAt: prismaQueueItem.created_at
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
