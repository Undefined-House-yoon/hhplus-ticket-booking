import { GetTokenUseCase } from './getToken.use-case';
import { AuthService } from '../../../domain/auth/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Token } from '../../../domain/auth/entities/token';
import { TokenRepository } from '../../../domain/auth/repositories/token.repository';
import { UserService } from '../../../domain/user/services/user.service';
import { User } from '../../../domain/user/entites/user';
import { IdentityModule } from '../../../api/Identity/identityModule';
import { CreateTokenDto } from '../../../api/Identity/dto/create-token.dto';


describe('GetTokenUseCase', () => {
  let useCase: GetTokenUseCase;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports:[IdentityModule],
    }).compile();

    useCase = module.get<GetTokenUseCase>(GetTokenUseCase);
    module.get<AuthService>(AuthService);
    module.get<TokenRepository>(TokenRepository);
    let userService = module.get<UserService>(UserService);
    await userService.createUser(User.create({id:1,balance:0 }));
  });

  test('[should] 토큰을 생성합니다.', async () => {
    const userId = 1;

    const createTokenDto: CreateTokenDto = new CreateTokenDto();
    createTokenDto.userId = userId;
    const expectedToken = new Token(userId);


    const result = await useCase.execute(createTokenDto);

    expect(result).toBeInstanceOf(Token);
    expect(result).toStrictEqual(expectedToken);
  });
  test('[should] 잘못된 사용자 ID에 대해 오류가 발생해야 합니다.', async () => {
    const invalidUserId = 999;

    await expect(useCase.execute({ userId: invalidUserId })).rejects.toThrow('User not found');
  });
});
