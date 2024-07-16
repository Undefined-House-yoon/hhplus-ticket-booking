import { Test, TestingModule } from '@nestjs/testing';
import { QueueUseCase } from './queue.use-case';
import { QueueService } from '../../../domain/auth/services/queue.service';
import { IdentityModule } from '../../../api/Identity/identityModule';

describe('QueueUseCase', () => {
  let useCase: QueueUseCase;
  let service: QueueService;
  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [IdentityModule],
    }).compile();

    useCase = module.get<QueueUseCase>(QueueUseCase);
    service = module.get<QueueService>(QueueService);
  });
  test('[should]사용자를 큐에 추가하고 현재 위치를 반환합니다.', async () => {
    const userId: number = 1;
    const result: number = await useCase.addToQueue(userId);
    expect(result).toEqual(1); //최초 생성은 반드시 1 반환
  });
  // 실패 시나리오
  test('[should fail] 동일한 사용자를 큐에 두 번 추가하려고 할 때', async () => {
    const userId: number = 1;
    await useCase.addToQueue(userId);
    await expect(useCase.addToQueue(userId)).rejects.toThrow('User already in queue');
  });

  test('[should] 사용자 ID의 현재 큐 위치를 조회합니다.', async () => {
    const createNum = 1000;
    let findUserid = 32;
    //순서대로 유저를 생성해본다음 비교함 동시라면 다르게 생각 해볼 필요가 있음
    for (let userId = 1; userId < createNum; userId++) {
      await useCase.addToQueue(userId);
    }

    const result = useCase.getPosition(findUserid);
    await expect(result).resolves.toEqual(findUserid);
  });

  test('[should fail] 존재하지 않는 사용자 ID로 위치를 조회할 때', async () => {
    const createNum = 1000;
    const nonExistentUserId = 2000;

    // 순서대로 유저를 생성해본 다음 비교함. 동시라면 다르게 생각해볼 필요가 있음
    for (let userId = 1; userId < createNum; userId++) {
      await useCase.addToQueue(userId);
    }

    const result = useCase.getPosition(nonExistentUserId);
    await expect(result).resolves.toEqual(-1);
  });

  test('[should fail] 이미 처리된 아이템을 다시 처리하려고 할 때', async () => {
    const createNum = 1000;
    for (let userId = 1; userId <= createNum; userId++) {
      await useCase.addToQueue(userId);
    }
  });

  test('[should]대기열의 아이템을 순서대로 processed 합니다. ', async () => {
    const createNum = 1000;
    const processed = -1; // 내 대기열이 없을때;
    for (let userId = 1; userId <= createNum; userId++) {
      useCase.addToQueue(userId);
    }

    //처리한 대기열은 userId 반환,
    let result = await useCase.processNextItem();
    let userQueueStatusNumber = await useCase.getPosition(result);
    expect(userQueueStatusNumber).toBe(processed);

    //더이상 처리 할게 없을때는 null
    for (let i = createNum; i >= 0; i--) {
      useCase.processNextItem();
    }
    let processedResult: number = await useCase.processNextItem();
    expect(processedResult).toBeNull();
  });


  test('[should fail] 이미 처리된 아이템을 다시 처리하려고 할 때', async () => {
    const createNum = 1000;
    for (let userId = 1; userId <= createNum; userId++) {
      await useCase.addToQueue(userId);
    }
  });

  test('[should]오래된 큐 아이템들을 정리합니다.', async () => {

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
    let result = await useCase.cleanup();

    expect(result).toBe(expiredCreatedQueue);
    await expect(useCase.getPosition(item.userId)).resolves.toBe(createQueue - expiredCreatedQueue);


  });

});
