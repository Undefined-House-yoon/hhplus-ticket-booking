import { Controller, Post, Body, Inject, UseGuards, Req, Get, Logger } from '@nestjs/common';
import { GetTokenUseCase } from '../../application/auth/use-cases/getToken.use-case';
import { CreateTokenDto } from './dto/create-token.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Token } from '../../domain/auth/entities/token';
import { AuthGuard } from '@nestjs/passport';
import { QueueFacade } from '../../application/auth/use-cases/queue-facade.service';
import { IsBoolean, isBoolean, IsNumber } from 'class-validator';
import { BasicAuthGuard } from '../../application/auth/authguard';

export class ResponseQueueDTO {
  @ApiProperty({ description: '대기:false, 입장 :true', example: false })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ description: '큐에서의 위치', example: 1 })
  @IsNumber()
  position: number;
}
type JwtTokenType = {
  userId: number;
  createAt: number;
  expiresAt: number;
};


@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger("MyService.name");
  constructor(
    @Inject(GetTokenUseCase) private readonly getTokenUseCase: GetTokenUseCase,
    @Inject(QueueFacade) private readonly queueFacade: QueueFacade,
  ) {
  }

  /**
   * 유저 토큰 발급 API
   * @route POST /auth/token
   * @param {CreateTokenDto} createTokenDto - 유저 ID를 포함한 DTO
   * @param {string} createTokenDto.userId - 유저 ID
   * @returns {Promise<Object>} 생성 토큰 유저 검증용
   */
  @Post('token')
  @ApiOperation({ summary: '유저 토큰 발급' })
  @ApiResponse({ status: 201, description: '토큰이 성공적으로 생성되었습니다.', type: Token })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @ApiResponse({ status: 500, description: '서버 에러입니다.' })
  @ApiBody({
    description: '토큰 발급을 위한 유저 정보', type: CreateTokenDto,
    examples: {
      example1: {
        summary: 'Example input',
        description: 'A typical request payload for issuing a token',
        value: { userId: 12345 },
      },
    },
  })
  async issueToken(@Body() createTokenDto: CreateTokenDto): Promise<string> {
    return this.getTokenUseCase.execute(createTokenDto.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '큐에 유저 추가' })
  @ApiResponse({ status: 201, description: '유저가 큐에 성공적으로 추가되었습니다.', type: ResponseQueueDTO })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  async createQueue(@Req() req): Promise<ResponseQueueDTO> {
    const user:JwtTokenType = req.user; // JWT에서 유저 정보 추출
    return this.queueFacade.addToQueue(user.userId);
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  @ApiOperation({ summary: '큐에서 유저의 위치 조회' })
  @ApiResponse({ status: 200, description: '유저의 큐 위치가 성공적으로 반환되었습니다.', type: ResponseQueueDTO })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '유저가 큐에 없습니다.' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  async getPosition(@Req() req): Promise<ResponseQueueDTO> {
    console.log('getPosition',req.user)
    const user:JwtTokenType = req.user; // JWT에서 유저 정보 추출
    return this.queueFacade.getPosition(user.userId);
  }
}

