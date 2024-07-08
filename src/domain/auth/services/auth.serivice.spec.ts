import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Token } from '../entities/token';
import { UserId } from '../vo/user-id.vo';
import { TokenRepository } from 'src/domain/auth/repositories/token.repository';

describe('AuthService', () => {
  let service: AuthService;
  let mockTokenRepository: jest.Mocked<TokenRepository>;

  beforeEach(async () => {
    mockTokenRepository = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'TokenRepository',
          useValue: mockTokenRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  test('[should] 토큰을 생성합니다.', async () => {
    const userId = 'user123';
    const createTokenDto = { userId };
    const expectedToken = new Token(new UserId(userId));

    mockTokenRepository.save.mockResolvedValue(expectedToken);

    const result = await service.createToken(createTokenDto);

    expect(result).toBeInstanceOf(Token);
    expect(result.getUserId().value).toBe(userId);
    expect(mockTokenRepository.save).toHaveBeenCalledWith(expect.any(Token));
  });
});
