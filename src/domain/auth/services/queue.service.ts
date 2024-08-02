import { Injectable } from '@nestjs/common';
import { QueueItem } from '../entities/queue-item';
import { QueueItemRepository } from '../repositories/queue-item.repository';


@Injectable()
export class QueueService {
  constructor(private readonly queueItemRepository: QueueItemRepository) {
  }

  // 새로운 대기열 항목 추가
  async addItem(userId: number): Promise<number> {
    const existingItem = await this.queueItemRepository.findByUserId(userId);
    if (existingItem) throw Error('User already in queue');

    const newItem = await this.queueItemRepository.create(userId);
    return newItem.id;
  }

  // 특정 항목의 대기열 위치 반환
  async getItemPosition(itemId: number): Promise<number> {
    // 전체 대기열 항목 중에서 처리되지 않은 항목들을 필터링
    const unprocessedItems = await this.queueItemRepository.findUnprocessed();
    // 필터링된 항목들 중에서 해당 항목의 인덱스를 찾음
    const itemIndex = unprocessedItems.findIndex(item => item.id === itemId);
    // 항목이 존재하면 1부터 시작하는 위치를 반환, 그렇지 않으면 -1 반환
    return itemIndex !== -1 ? itemIndex + 1 : -1;
  }

  // 특정 사용자 ID의 대기열 항목 조회
  async findQueueItemByUserId(userId: number): Promise<QueueItem | null> {
    return this.queueItemRepository.findByUserId(userId);
  }


  // 큐의 다음 아이템을 처리
  async processNextItem(): Promise<QueueItem | null> {
    const unprocessedItems = await this.queueItemRepository.findUnprocessed();
    if (unprocessedItems.length == 0) return null;
    const nextItem = unprocessedItems[0];
    //대기열 대기 끝 업데이트
    nextItem.shouldProcess();
    return this.queueItemRepository.updateProcessed(nextItem.id, nextItem.isProcessed());
  }


  // 오래된 항목 정리 및 제거된 항목 수 반환
  async removeExpiredItems(): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.queueItemRepository.removeExpiredItems(oneHourAgo);
  }
}
