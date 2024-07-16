import { Test, TestingModule } from '@nestjs/testing';
import { BalanceUseCase } from './balance.use-case';
import { BalanceService } from '../../../domain/balance/services/balance.service';
import { BalanceModule } from '../../../api/balance/balance.module';
import { UserService } from '../../../domain/balance/services/user.service';
import { User } from '../../../domain/balance/entities/user';

describe('BalanceUseCase', () => {
  let useCase: BalanceUseCase;
  let service: BalanceService;
  let userService: UserService

  beforeEach(async () => {


    const module: TestingModule = await Test.createTestingModule({
      imports:[BalanceModule],
    }).compile();

    useCase = module.get<BalanceUseCase>(BalanceUseCase);
    service = module.get<BalanceService>(BalanceService);
    userService = module.get<UserService>(UserService);

    //기본 유저 생성
    await userService.createUser(User.create({id:1,balance:1}));
  });


  describe('chargeBalance', () => {
    it('[should]  잔액을 충전, 반환해야 합니다.', async () => {
      jest.spyOn(service,'chargeBalance')
      const result = await useCase.chargeBalance(1, 10000);

      expect(service.chargeBalance).toHaveBeenCalledWith(1, 10000);
      expect(result).toEqual({ balance: 10000 });
    });
    it('[should] 잘못된 사용자 ID로 충전 시 에러를 던져야 합니다.', async () => {
      jest.spyOn(service, 'chargeBalance');

      await expect(useCase.chargeBalance(999, 10000)).rejects.toThrow('User not found');
      expect(service.chargeBalance).toHaveBeenCalledWith(999, 10000);

    });

    it('[should] 음수 금액 충전 시 에러를 던져야 합니다.', async () => {
      await expect(useCase.chargeBalance(1, -1000)).rejects.toThrow('Invalid amount');
    });
  });

  describe('getBalance', () => {
    it('[should]현재 잔액 반환', async () => {
      await useCase.chargeBalance(1, 15000);
      jest.spyOn(service, 'getBalance');
      const result = await useCase.getBalance(1);

      expect(result).toEqual({ balance: 15000 });
      expect(service.getBalance).toHaveBeenCalledWith(1);
    });
    it('[should] 존재하지 않는 사용자의 잔액 조회 시 에러를 던져야 합니다.', async () => {
      jest.spyOn(service, 'getBalance');

      await expect(useCase.getBalance(999)).rejects.toThrow('User not found');
    });
  });
});
