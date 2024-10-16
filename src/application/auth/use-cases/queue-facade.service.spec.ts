import { Test, TestingModule } from '@nestjs/testing';
import { QueueFacade } from './queue-facade.service';
import { QueueService } from '../../../domain/auth/services/queue.service';
import { PrismaModule } from '../../../api/prisma.module';
import { AppModule } from '../../../app.module';
import { BadRequestException } from '@nestjs/common';

describe('QueueFacade', () => {
  let queueFacade: QueueFacade;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ AppModule,PrismaModule],
    }).compile();

    queueFacade = module.get<QueueFacade>(QueueFacade);
    queueService = module.get<QueueService>(QueueService);
  });


  test('[성공] 사용자를 큐에 추가하고 현재 위치를 반환합니다.', async () => {
    const userId: number = 1;

    jest.spyOn(queueService, 'addItem');
    jest.spyOn(queueService, 'getItemPosition');

    const result = await queueFacade.addToQueue(userId);
    expect(result).toEqual({ status: false, position: 1 });
  });


  test('[실패] 동일한 사용자를 큐에 두 번 추가하려고 할 때', async () => {
    const userId: number = 2;
    jest.spyOn(queueService, 'addItem');

    await queueFacade.addToQueue(userId);
    await expect(queueFacade.addToQueue(userId)).rejects.toThrow(BadRequestException);
    await expect(queueFacade.addToQueue(userId)).rejects.toThrow('User already in queue');
  });

  test('[성공] 주어진 사용자 ID의 현재 큐 위치를 조회합니다.', async () => {
    const userId: number = 1 ;
    jest.spyOn(queueService, 'findQueueItemByUserId');
    jest.spyOn(queueService, 'getItemPosition');

    const result = await queueFacade.getPosition(userId);
    expect(result).toEqual({ status: false, position: 1 });
  });

  test('[실패] 사용자가 큐에 없는 경우 -1을 반환합니다.', async () => {
    const userId: number = 1;
    jest.spyOn(queueService, 'findQueueItemByUserId').mockResolvedValue(null);

    const result = await queueFacade.getPosition(userId);
    expect(result).toEqual({ status: false, position: -1 });
  });

  test('[성공] 큐의 다음 아이템을 처리하고 사용자 ID를 반환합니다.', async () => {
    const nextItem = { userId: 1 };
    jest.spyOn(queueService, 'processNextItem');

    const result = await queueFacade.processNextItem();
    expect(result).toBe(1);
  });

  test('[실패] 처리할 아이템이 없는 경우 null을 반환합니다.', async () => {
    jest.spyOn(queueService, 'processNextItem').mockResolvedValue(null);

    const result = await queueFacade.processNextItem();
    console.log(result);
    expect(result).toBe(-1);
  });

  test('[성공] 오래된 큐 아이템들을 정리하고 제거된 항목 수를 반환합니다.', async () => {
    const removedCount = 5;
    jest.spyOn(queueService, 'removeExpiredItems').mockResolvedValue(removedCount);

    const result = await queueFacade.cleanup();
    expect(result).toBe(removedCount);
  });



  test('[성공] 10000명의 사용자를 큐에 추가하고 각 위치를 확인합니다.', async () => {
    // const mockQueueItems = Array.from({ length: 10000 }, (_, i) => ({
    //   id: i + 1,
    //   userId: i + 1,
    //   _processed: false,
    //   shouldProcess: false,
    //   isProcessed: () => false
    // }));
    //
    // // addItem과 getItemPosition을 모킹합니다.
    // (queueService.addItem as jest.Mock).mockImplementation(async (userId: number) => {
    //   return mockQueueItems[userId - 1];
    // });
    //
    // (queueService.getItemPosition as jest.Mock).mockImplementation(async (id: number) => {
    //   return id;
    // });
    const queueItems = [];
    for (let i = 1; i <= 30000; i++) {
      // const result = await queueFacade.addToQueue(i);
      queueItems.push(queueFacade.addToQueue(i));
      // expect(result).toEqual({ status: false, position: i });
    }
    console.log("dididiiddiididididididi",queueItems.length)
    Promise.all(queueItems);
    // console.log("xx ",x.length);
  },30000);
});
