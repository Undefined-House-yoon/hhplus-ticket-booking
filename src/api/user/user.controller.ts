import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../domain/user/entites/user';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserUseCase } from '../../application/auth/use-cases/create-user.use-case';

@Controller('users')
export class UserController {

  constructor(@Inject(CreateUserUseCase)private readonly userUseCase: CreateUserUseCase) {
  }

  /**
   * 유저 생성 API
   * @route POST /users
   * @param {number} createUserDto.userId - 유저 ID
   * @param {number} createUserDto.balance - 잔액
   * @returns {Promise<Object>} 생성된 토큰과 대기열 정보
   * @param createUserDto
   */
  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({
    status: 201,
    description: '유저가 생성되었습니다.',
  })
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userUseCase.execute(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getUserInfo(@Param('id') userId: number): string{
    // 유저 정보 조회 로직
    return "asdfasdf";
  }

}
