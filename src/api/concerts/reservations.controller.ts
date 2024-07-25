import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateReservationDto } from './dto/create-reservation-date.dto';
import { ReservationUseCase } from '../../application/concerts/use-cases/reservation.use-case';
import { RefundResponseDto } from './dto/refund-response.dto';
import { RefundRequestDto } from './dto/refund-request.dto';


@ApiTags('Reservations')
@Controller('concerts/reservations')
export class ReservationController {
  constructor(private readonly reservationUseCase: ReservationUseCase) {
  }


  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '예약 만들기' })
  @ApiResponse({ status: 201, description: '예약이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 - 유효하지 않은 입력' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 409, description: '이미 예약된 좌석입니다.' })
  async createReservation(@Req() req, @Body() createReservationDto: CreateReservationDto) {
    createReservationDto.userId = req.user.id; // JWT에서 사용자 ID를 가져옵니다.
    return this.reservationUseCase.createReservation(createReservationDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자의 예약 목록 조회' })
  @ApiResponse({ status: 200, description: '사용자의 예약 목록을 반환합니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  async getUserReservations(@Req() req) {
    return this.reservationUseCase.getUserReservations(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 예약 상세 정보 조회' })
  @ApiResponse({ status: 200, description: '예약 상세 정보를 반환합니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없음' })
  @ApiParam({ name: 'id', type: Number, description: '조회할 예약 ID' })
  async getReservationDetails(@Req() req, @Param('id') id: number) {
    return this.reservationUseCase.getReservationDetails(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '예약 취소' })
  @ApiResponse({ status: 200, description: '예약이 성공적으로 취소되었습니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없음' })
  @ApiParam({ name: 'id', type: Number, description: '취소할 예약 ID' })
  async cancelReservation(@Req() req, @Param('id') id: number) {
    return this.reservationUseCase.cancelReservation(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refunds')
  processRefund(@Body() refundRequestDto: RefundRequestDto): Promise<RefundResponseDto> {
    // 환불 처리 로직
    return ;
  }
}
