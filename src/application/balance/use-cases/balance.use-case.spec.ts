import { Test, TestingModule } from '@nestjs/testing';
import { BalanceUseCase } from './balance.use-case';
import { BalanceService } from '../../../domain/balance/services/balance.service';

describe('BalanceUseCase', () => {
  let useCase: BalanceUseCase;
  let serviceMock: jest.Mocked<BalanceService>;

  beforeEach(async () => {
    const serviceMockFactory = jest.fn(() => ({
      chargeBalance: jest.fn(),
      getBalance: jest.fn(),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceUseCase,
        {
          provide: BalanceService,
          useFactory: serviceMockFactory,
        },
      ],
    }).compile();

    useCase = module.get<BalanceUseCase>(BalanceUseCase);
    serviceMock = module.get(BalanceService);
  });

  describe('chargeBalance', () => {
    it('[should]  잔액을 충전, 반환해야 합니다.', async () => {
      serviceMock.chargeBalance.mockResolvedValue(20000);

      const result = await useCase.chargeBalance(1, 10000);

      expect(serviceMock.chargeBalance).toHaveBeenCalledWith(1, 10000);
      expect(result).toEqual({ balance: 20000 });
    });
  });

  describe('getBalance', () => {
    it('[should]현재 잔액 반환', async () => {
      serviceMock.getBalance.mockResolvedValue(15000);

      const result = await useCase.getBalance(1);

      expect(serviceMock.getBalance).toHaveBeenCalledWith(1);
      expect(result).toEqual({ balance: 15000 });
    });
  });
});
