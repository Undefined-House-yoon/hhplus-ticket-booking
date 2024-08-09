import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { QueueItem } from '../../../domain/auth/entities/queue-item';
import { QueueItemRepository } from '../../../domain/auth/repositories/queue-item.repository';
import { QueueItemMapper } from '../mapper/queue-item.mapper';
import { ErrorHandler } from '../../../exceptions/exception';

@Injectable()
export class QueueItemRepositoryImpl implements QueueItemRepository {
  constructor(private prisma: PrismaService) {
  }

  /**
   * 새로운 QueueItem 생성
   * @param userId - 사용자 ID
   * @returns 생성된 QueueItem
   */
  async create(userId: number): Promise<QueueItem> {
    try {
      const queueItem = await this.prisma.queueItem.create({
        data: {
          user_id: userId,
        },
      });
      console.log(`Created queue item for user ${userId}`);
      return QueueItemMapper.toDomain(queueItem);
    } catch (error) {
      ErrorHandler.badRequest(`Failed to create queue item for user ${userId}:${error.message}`)
    }
  }

  /**
   * ID로 QueueItem 찾기
   * @param id - QueueItem ID
   * @returns QueueItem 또는 null
   */
  async findById(id: number): Promise<QueueItem | null> {
    const queueItem = await this.prisma.queueItem.findUnique({
      where: { id },
    });
    return QueueItemMapper.toDomain(queueItem);
  }

  /**
   * 사용자 ID로 처리되지 않은 QueueItem 찾기
   * @param userId - 사용자 ID
   * @returns QueueItem 또는 null
   */
  async findByUserId(userId: number): Promise<QueueItem | null> {
    const queueItem = await this.prisma.queueItem.findFirst({
      where: { user_id: userId, processed: false },
    });
    return queueItem?QueueItemMapper.toDomain(queueItem):null;
  }

  /**
   * 처리되지 않은 모든 QueueItem 찾기
   * @returns 처리되지 않은 QueueItem 배열
   */
  async findUnprocessed(): Promise<QueueItem[]> {
    const queueItems = await this.prisma.queueItem.findMany({
      where: { processed: false },
      orderBy: { createdAt: 'asc' },
    });
    if (queueItems)  return QueueItemMapper.toDomainList(queueItems);
    return [];
  }

  /**
   * QueueItem의 처리 상태 업데이트
   * @param id - QueueItem ID
   * @param processed - 처리 상태
   * @returns 업데이트된 QueueItem
   */
  async updateProcessed(id: number, processed: boolean): Promise<QueueItem> {
    const queueItem = await this.prisma.queueItem.update({
      where: { id },
      data: { processed },
    });
    return QueueItemMapper.toDomain(queueItem);
  }

  /**
   * 만료된 QueueItem 제거
   * @param expirationDate - 만료 기준 날짜
   * @returns 제거된 항목 수
   */
  async removeExpiredItems(expirationDate: Date): Promise<number> {
    const { count } = await this.prisma.queueItem.deleteMany({
      where: {
        processed: false,
        createdAt: {
          lt: expirationDate,
        },
      },
    });
    return count;
  }

  async findAfterTime(time: Date): Promise<QueueItem[]> {
    const queueItems = await this.prisma.queueItem.findMany({
      where: {
        createdAt: { lt: time },
        processed: false,
      },
    });
    return queueItems ? QueueItemMapper.toDomainList(queueItems) : [];
  }

  async findByLimitCount(count: number): Promise<QueueItem[]> {
    const queueItems = await this.prisma.queueItem.findMany({
      where: { processed: false },
      orderBy: { createdAt: 'asc' },
      take: count,
    });
    return queueItems ? QueueItemMapper.toDomainList(queueItems) : [];
  }

  async activatePendingTokens(ids: number[]): Promise<void> {
    await this.prisma.queueItem.updateMany({
      where: { id: { in: ids } },
      data: { processed: true },
    });
  }

  async expireOldTokens(ids: number[]): Promise<void> {
    await this.prisma.queueItem.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
