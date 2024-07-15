import { Injectable } from '@nestjs/common';
import { QueueItem } from '../entities/queue-item';


@Injectable()
export class QueueService {
  private queue: QueueItem[] = [];
  private currentId = 1;

  constructor() {
  }

  // 새로운 대기열 항목 추가
  async addItem(userId: number): Promise<number> {
    const newItem: QueueItem = {
      id: this.currentId++,
      userId,
      processed: false,
      createdAt: new Date(),
    };

    this.queue.push(newItem);
    return newItem.id;
  }

  // 특정 항목의 대기열 위치 반환
  async getItemPosition(itemId: number): Promise<number> {
    // 전체 대기열 항목 중에서 처리되지 않은 항목들을 필터링
    const unprocessedItems = this.queue.filter(item => !item.processed);

    // 필터링된 항목들 중에서 해당 항목의 인덱스를 찾음
    const itemIndex = unprocessedItems.findIndex(item => item.id === itemId);

    // 항목이 존재하면 1부터 시작하는 위치를 반환, 그렇지 않으면 -1 반환
    return itemIndex !== -1 ? itemIndex + 1 : -1;
  }

  // 특정 사용자 ID의 대기열 항목 조회
  async findQueueItemByUserId(userId: number): Promise<QueueItem | null> {
    const item = this.queue.find(item => item.userId === userId && !item.processed);
    return item || null;
  }

  // 큐의 다음 아이템을 처리
  async processNextItem(): Promise<QueueItem | null> {
    const nextItem = this.queue.find(item => !item.processed);
    if (!nextItem) return null;

    await this.markItemAsProcessed(nextItem);
    return nextItem;
  }

  // 아이템을 processed 된 것으로 표시
  async markItemAsProcessed(item: QueueItem): Promise<void> {
    item.processed = true;
    // 위치를 재조정
    await this.updatePositions();
  }

  // 오래된 항목 정리 및 제거된 항목 수 반환
  async removeExpiredItems(): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const initialLength = this.queue.length;
    this.queue = this.queue.filter(item => !item.processed && item.createdAt >= oneHourAgo);
    const removedCount = initialLength - this.queue.length;

    // 위치를 재조정
    await this.updatePositions();
    return removedCount;
  }

  // 위치 재조정 메서드
  private async updatePositions(): Promise<void> {
    const unprocessedItems = this.queue.filter(item => !item.processed).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    for (let i = 0; i < unprocessedItems.length; i++) {
      unprocessedItems[i].id = i + 1;  // 포지션 재조정
    }
  }


}
