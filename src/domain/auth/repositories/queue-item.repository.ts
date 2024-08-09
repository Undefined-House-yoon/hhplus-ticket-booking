import { QueueItem } from '../entities/queue-item';

export abstract class QueueItemRepository {

  abstract create(userId: number): Promise<QueueItem>;

  abstract findById(id: number): Promise<QueueItem | null> ;

  abstract findByUserId(userId: number): Promise<QueueItem | null> ;

  abstract findUnprocessed(): Promise<QueueItem[]> ;

  abstract updateProcessed(id: number, processed: boolean): Promise<QueueItem> ;

  abstract removeExpiredItems(expirationDate: Date): Promise<number> ;


  abstract findAfterTime(time: Date): Promise<QueueItem[]> ;

  abstract findByLimitCount(count: number): Promise<QueueItem[]> ;

  abstract activatePendingTokens(ids: number[]): Promise<void> ;

  abstract expireOldTokens(ids: number[]): Promise<void> ;
}
