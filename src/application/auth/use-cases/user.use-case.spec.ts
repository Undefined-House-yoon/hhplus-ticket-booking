import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../domain/user/services/user.service'; // UserService의 경로에 맞게 수정
import { CreateUserDto } from '../../../api/user/dto/create-user.dto'; // CreateUserDto의 경로에 맞게 수정
import { User } from '../../../domain/user/entites/user';
import { CreateUserUseCase } from './create-user.use-case';
import { AuthModule } from '../../../api/auth/auth.module';

describe('UserUseCase', () => {
  let userUseCase: CreateUserUseCase;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[AuthModule],
    }).compile();

    userUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userUseCase).toBeDefined();
  });

  describe('create', () => {
    it('[should] 유저 생성 ', async () => {
      const dto: CreateUserDto = {userId:1,amount:1000}

      jest.spyOn(User, 'create');
      jest.spyOn(userService, 'createUser');

      const {id,balance} = await userUseCase.execute(dto);

      expect(id).toBe(1);
      expect(balance).toBe(1000);
    });
    it('[should] createUserDto가 유효하지 않으면 오류가 발생해야 합니다.', async () => {
      const dto: CreateUserDto = { userId: null, amount: 1000 }; // 유효하지 않은 DTO

      await expect(userUseCase.execute(dto)).rejects.toThrow('ID is required');
    });

    it('[should] createUserDto의 amount가 음수면 오류가 발생해야 합니다.', async () => {
      const dto: CreateUserDto = { userId: 1, amount: -1000 }; // 유효하지 않은 금액

      await expect(userUseCase.execute(dto)).rejects.toThrow('Invalid amount');
    });

  });
});
