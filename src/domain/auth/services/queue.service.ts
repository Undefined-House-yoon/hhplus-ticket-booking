import { Injectable } from '@nestjs/common';
import { QueueItem } from '../entities/queue-item';
import { QueueItemRepository } from '../repositories/queue-item.repository';
import { ErrorHandler } from '../../../exceptions/exception';


@Injectable()
export class QueueService {
  constructor(private readonly queueItemRepository: QueueItemRepository) {
  }

  // 새로운 대기열 항목 추가
  async addItem(userId: number): Promise<QueueItem> {
    const existingItem = await this.queueItemRepository.findByUserId(userId);
    if (existingItem) throw ErrorHandler.badRequest('User already in queue');
    return this.queueItemRepository.create(userId);
  }

  // 특정 항목의 대기열 위치 반환
  async getItemPosition(itemId: number): Promise<number> {
    // 전체 대기열 항목 중에서 처리되지 않은 항목들을 필터링 날짜순
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
    // 전체 대기열 항목 중에서 처리되지 않은 항목들을 필터링 날짜순
    const unprocessedItems = await this.queueItemRepository.findUnprocessed();
    if (unprocessedItems.length == 0) return null;
    const nextItem = unprocessedItems[0];
    //대기열 대기 끝 업데이트
    nextItem.shouldProcess();
    return this.queueItemRepository.updateProcessed(nextItem.id, nextItem.isProcessed());
  }


  // 오래된 항목 정리 및 제거된 항목 수 반환
  async removeExpiredItems(): Promise<number> {
    const fiveMinute = new Date(Date.now() - 5 * 60 * 1000);
    return this.queueItemRepository.removeExpiredItems(fiveMinute);
  }

  // 5분 이상 경과한 토큰 조회
  async getTokensAfter5Minutes(): Promise<QueueItem[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.queueItemRepository.findAfterTime(fiveMinutesAgo);
  }

  // 활성화할 토큰 리스트 조회
  async getTokenListToBeActivated(count: number): Promise<QueueItem[]> {
    return this.queueItemRepository.findByLimitCount(count);
  }

  // 대기중인 토큰 활성화
  async activatePendingTokens(ids: number[]): Promise<void> {
    await this.queueItemRepository.activatePendingTokens(ids);
  }

  //만료 시킬 토큰
  async expireOldTokens(ids: number[]): Promise<void> {
    await this.queueItemRepository.expireOldTokens(ids);
  }
}
