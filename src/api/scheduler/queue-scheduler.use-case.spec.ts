import { Test, TestingModule } from '@nestjs/testing';
import { QueueFacade } from '../../application/auth/use-cases/queue-facade.service';
import { QueueService } from '../../domain/auth/services/queue.service';
import { QueueScheduler } from './queue-scheduler.use-case';
import { AuthModule } from '../auth/auth.module';

describe('QueueUseCase', () => {
  let scheduler: QueueScheduler;
  let useCase: QueueFacade;
  let service: QueueService;
  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    scheduler = module.get<QueueScheduler>(QueueScheduler);
    useCase = module.get<QueueFacade>(QueueFacade);
    service = module.get<QueueService>(QueueService);
  });
  it('[should]오래된 큐 아이템들을 정리합니다.', async () => {

    let oneHourAgo = new Date(Date.now() - (60 * 60 * 1000));
    // Date 객체를 모킹하여 항상 mockedDate를 반환하도록 설정
    jest.spyOn(global, 'Date').mockImplementation(() => oneHourAgo);

    const expiredCreatedQueue = 500;
    const createQueue = 1000;
    for (let userId = 1; userId <= expiredCreatedQueue; userId++) {
      await useCase.addToQueue(userId);
    }
    jest.restoreAllMocks();

    for (let userId = expiredCreatedQueue + 1; userId <= createQueue; userId++) {
      await useCase.addToQueue(userId);
    }
    let item = await service.findQueueItemByUserId(1000);

    //스케줄러라 반환값 없고 행위만 하면 됩니다.
    await scheduler.handleCron();
    //최종적으로 만료된 친구들이 맞는지만 확인하면 됩니다.
    await expect(useCase.getPosition(item.userId)).resolves.toBe(createQueue - expiredCreatedQueue);

  });

});
