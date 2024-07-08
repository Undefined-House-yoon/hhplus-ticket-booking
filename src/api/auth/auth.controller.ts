import { Controller, Post, Body, Inject } from '@nestjs/common';
import { GetTokenUseCase } from '../../application/auth/use-cases/getToken.use-case';
import { CreateTokenDto } from './dto/create-token.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AuthController {

  constructor(@Inject(GetTokenUseCase)private readonly getTokenUseCase: GetTokenUseCase) {
  }

  /**
   * 유저 토큰 발급 API
   * @route POST /token
   * @param {CreateTokenDto} createTokenDto - 유저 ID를 포함한 DTO
   * @param {string} createTokenDto.userId - 유저 ID
   * @returns {Promise<Object>} 생성된 토큰과 대기열 정보
   */
  @Post('token')
  @ApiOperation({ summary: '유저 토큰 발급' })
  @ApiResponse({
    status: 201,
    description: '토큰이 성공적으로 생성되었습니다.',
  })
  @ApiBody({ type: CreateTokenDto })
  issueToken(@Body() createTokenDto: CreateTokenDto): Promise<any> {
    return this.getTokenUseCase.execute(createTokenDto);
  }
}
