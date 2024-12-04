import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { Token } from '../entities/token';
import { TokenRepository } from 'src/domain/auth/repositories/token.repository';

describe('TokenService', () => {
  let service: TokenService;
  let mockTokenRepository: jest.Mocked<TokenRepository>;

  beforeEach(async () => {
    mockTokenRepository = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: 'TokenRepository',
          useValue: mockTokenRepository,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  test('[should] 토큰을 생성합니다.', async () => {
    const userId = 1;
    const createTokenDto = { userId };
    const expectedToken = Token.create({ userId });

    mockTokenRepository.save.mockResolvedValue(expectedToken);

    const result = await service.createToken(createTokenDto);

    expect(result).toBeInstanceOf(Token);
    expect(result.userId).toBe(userId);
    expect(mockTokenRepository.save).toHaveBeenCalledWith(expect.any(Token));
  });
});
