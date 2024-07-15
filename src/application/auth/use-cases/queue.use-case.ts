// application/queue.usecase.ts
import { Injectable } from '@nestjs/common';
import { QueueService } from '../../../domain/auth/services/queue.service';

@Injectable()
export class QueueUseCase {
  constructor(private queueService: QueueService) {}

  /**
   * 사용자를 큐에 추가하고 현재 위치를 반환합니다.
   * @param userId 사용자 ID
   * @returns 큐에서의 위치 (1부터 시작)
   */
  async addToQueue(userId: number): Promise<number> {
    const itemId = await this.queueService.addItem(userId);
    return await this.queueService.getItemPosition(itemId);
  }

  /**
   * 주어진 사용자 ID의 현재 큐 위치를 조회합니다.
   * @param userId 사용자 ID
   * @returns 큐에서의 위치 (1부터 시작), 큐에 없으면 -1
   */
  async getPosition(userId: number): Promise<number> {
    // 주어진 사용자 ID에 해당하는 대기열 항목을 조회
    const queueItem = await this.queueService.findQueueItemByUserId(userId);
    if (!queueItem) return -1; // 대기열에 항목이 없으면 -1 반환

    // 항목의 위치를 반환
    return await this.queueService.getItemPosition(queueItem.id);
  }

  /**
   * 큐의 다음 아이템을 processed 합니다.
   * @returns 처리된 아이템의 사용자 ID, 처리할 아이템이 없으면 null
   */
  async processNextItem(): Promise<number | null> {
    const nextItem = await this.queueService.processNextItem();
    if (!nextItem) return null;

    await this.queueService.markItemAsProcessed(nextItem);
    return nextItem.userId;
  }

  /**
   * 오래된 큐 아이템들을 정리합니다.
   * 1시간 이상 지난 아이템들을 삭제합니다.
   */
  async cleanup(): Promise<number> {
    const removedCount :number = await this.queueService.removeExpiredItems();
    console.log(`Cleaned up ${removedCount} old queue items.`);
    return removedCount;
  }
}
