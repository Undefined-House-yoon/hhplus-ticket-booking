import { Body, Controller, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserUseCase } from '../../application/auth/use-cases/user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../domain/user/entites/user';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class UserController {

  constructor(@Inject(UserUseCase)private readonly userUseCase: UserUseCase) {
  }

  /**
   * 유저 생성 API
   * @route POST /users
   * @param {number} createUserDto.userId - 유저 ID
   * @param {number} createUserDto.balance - 잔액
   * @returns {Promise<Object>} 생성된 토큰과 대기열 정보
   * @param createUserDto
   */
  @Post('users')
  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({
    status: 201,
    description: '유저가 생성되었습니다.',
  })
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userUseCase.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUserInfo(@Query('userId') userId: string): string{
    // 유저 정보 조회 로직
    return "asdfasdf";
  }

}
