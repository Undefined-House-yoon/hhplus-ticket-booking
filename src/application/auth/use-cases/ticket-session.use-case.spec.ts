import { TicketSessionUseCase } from './ticket-session.use-case';
import { TicketSessionService } from '../../../domain/auth/services/ticket-session.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TicketSession, TicketStatus } from '../../../domain/auth/entities/ticket-session';

describe('TicketSessionUseCase', () => {
  let useCase: TicketSessionUseCase;
  let service: TicketSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
    }).compile();

    useCase = module.get<TicketSessionUseCase>(TicketSessionUseCase);
    service = module.get<TicketSessionService>(TicketSessionService);

  });

  it('[should] 티켓 조회를 시작하면 티켓 세션을 추가합니다.', async () => {
    const userId: number = 1;
    await useCase.startViewing(userId);
    let session: TicketSession = await service.findSessionByUserId(userId);
    expect(session.userId).toBe(userId);
  });
  it('[should fail] 잘못된 입력으로 인해 티켓 세션이 추가되지 않습니다.', async () => {
    const userId = null; // 잘못된 입력
    await expect(useCase.startViewing(userId)).rejects.toThrow('Invalid user ID'); // 유효성 검사 실패
  });


  it('[should] 사용자가 티켓 결제를 완료하면 status를 purchased로 변경합니다.', async () => {
    const userId: number = 1;
    await useCase.startViewing(userId);
    let session: TicketSession = await service.findSessionByUserId(userId);
    // 이후 해당 세션은 find로 검색되지 않는다 , 상태가 바뀌면 검색이 안됩니다.
    await useCase.completePurchase(userId);
    expect(session.status).toBe(TicketStatus.purchased);
  });

  it('[should fail] 이미 결제된 티켓으로 인해 상태가 변경되지 않습니다.', async () => {
    const userId = 1;
    await useCase.startViewing(userId);
    let session =await service.findSessionByUserId(userId);

    // 결제하기
    await useCase.completePurchase(userId);

    await expect(useCase.completePurchase(userId)).rejects.toThrow('Session is Not Found');
    expect(session.status).toBe(TicketStatus.purchased); // 상태가 변경되지 않음
  });

  it('[should fail] 만료된 티켓으로 인해 상태가 변경되지 않습니다.', async () => {
    const userId = 1;
    jest.useFakeTimers();
    let nockNow = Date.now();
    let fifteenMinutesAgo = new Date(nockNow - 16 * 60 * 1000);//15분전으로 세팅 (만료가 15분 후부터)
    jest.setSystemTime(fifteenMinutesAgo);

    await useCase.startViewing(userId);
    let session =await service.findSessionByUserId(userId);
    jest.useRealTimers();
    await useCase.cleanupExpiredItems();

    await expect(useCase.completePurchase(userId)).rejects.toThrow('Ticket is expired');
    expect(session.status).toBe(TicketStatus.expired); // 상태가 만료로 변경
  });

  it('[should] 만료된 세션을 정리하고, 제거된 항목의 수를 반환합니다.', async () => {
    jest.useFakeTimers();
    let nockNow = Date.now();
    let fifteenMinutesAgo = new Date(nockNow - 16 * 60 * 1000);//15분전으로 세팅 (만료가 15분 후부터)

    jest.setSystemTime(fifteenMinutesAgo);
    for (let i = 1; i <= 100; i++) {
      await useCase.startViewing(i);
    }

    jest.useRealTimers();
    // jest.restoreAllMocks();

    await expect(useCase.cleanupExpiredItems()).resolves.toBe(100);
  });


  test('[should fail] 내부 오류로 인해 일부 만료된 세션이 제거되지 않습니다.', async () => {
    jest.useFakeTimers();

    let now = Date.now();
    let fifteenMinutesAgo = new Date(now - 16 * 60 * 1000); // 15분 전으로 설정 (만료가 15분 후부터)

    jest.setSystemTime(fifteenMinutesAgo);
    for (let i = 1; i <= 100; i++) {
      await useCase.startViewing(i);
    }

    jest.useRealTimers();

    service.removeExpiredSessions = jest.fn();
    // 일부 세션이 제거되지 않음
    (service.removeExpiredSessions as jest.Mock).mockImplementation(() => {
      throw new Error('Internal error');
    });

    await expect(useCase.cleanupExpiredItems()).rejects.toThrow('Internal error');
  });
});
