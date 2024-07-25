import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { QueueItem } from '../../../domain/auth/entities/queue-item';
import { QueueItemRepository } from '../../../domain/auth/repositories/queue-item.repository';
import { QueueItemMapper } from '../mapper/queue-item.mapper';

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
    const queueItem = await this.prisma.queueItem.create({
      data: {
        user_id: userId,
      },
    });
    return QueueItemMapper.toDomain(queueItem);
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
    return QueueItemMapper.toDomain(queueItem);
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
    return QueueItemMapper.toDomainList(queueItems);
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
}
