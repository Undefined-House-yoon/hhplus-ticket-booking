import { GetTokenUseCase } from './getToken.use-case';
import { AuthService } from '../../../domain/auth/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserId } from '../../../domain/auth/vo/user-id.vo';
import { Token } from '../../../domain/auth/entities/token';
import { CreateTokenDto } from '../../../api/auth/dto/create-token.dto';
import { TokenRepository, TokenRepositoryImpl } from '../../../domain/auth/repositories/token.repository';
import { AuthModule } from '../../../api/auth/auth.module';


describe('GetTokenUseCase', () => {
  let module: TestingModule;
  let useCase: GetTokenUseCase;
  let service: AuthService;
  let tokenRepository: TokenRepository;
  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports:[AuthModule],
    }).compile();

    useCase = module.get<GetTokenUseCase>(GetTokenUseCase);
    service = module.get<AuthService>(AuthService);
    tokenRepository = module.get<TokenRepository>(TokenRepository);
  });

  test('[should] 토큰을 생성합니다.', async () => {
    const userId = 'user123';
    const createTokenDto: CreateTokenDto = new CreateTokenDto();
    createTokenDto.userId = userId;
    const expectedToken = new Token(new UserId(userId));


    const result = await useCase.execute(createTokenDto);

    expect(result).toBeInstanceOf(Token);
    expect(result).toStrictEqual(expectedToken);
  });
  test('[should] 잘못된 사용자 ID에 대해 오류가 발생해야 합니다.', async () => {
    const invalidUserId = '';

    await expect(useCase.execute({ userId: invalidUserId })).rejects.toThrow('User ID cannot be empty');
  });
});
