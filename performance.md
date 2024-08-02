### 조회가 오래 걸리는 쿼리를 캐싱하거나 Redis를 이용한 로직 이관을 통해 성능을 개선.


### 1. 현재 시스템 분석

**조회가 오래 걸리는 API 엔드포인트 식별**:
- `/dates`: 예약 가능한 날짜 목록 조회
- `/dates/:concertDetailId`: 콘서트 예약 가능한 좌석 정보 조회
- `/reservations`: 유저 예약 목록 조회
- `/reservations/:id`: 특정 예약 상세 정보 조회

**병목 지점 분석**:
- 데이터베이스에서 대량의 데이터를 조회하거나, 복잡한 조인 및 필터링 작업을 수행할 때 조회 시간이 오래 걸릴 수 있습니다.

### 2. 캐싱 및 Redis 도입의 필요성 평가

**캐싱 대상 선정**:
- `/dates`: 예약 가능한 날짜 목록은 자주 변경되지 않으므로 캐싱 적합.
- `/dates/:concertDetailId`: 콘서트 좌석 정보는 자주 변경되지 않으므로 캐싱 적합.
- `/reservations`: 유저 예약 목록은 자주 변경될 수 있으나, 특정 사용자의 요청 빈도가 높다면 캐싱 가능.
- `/reservations/:id`: 특정 예약 상세 정보는 자주 변경될 가능성이 낮음.

**Redis 도입의 필요성**:
- Redis를 이용한 캐싱을 통해 데이터베이스 조회 횟수를 줄여 성능을 개선할 수 있습니다.
- Redis의 빠른 조회 속도를 활용하여 빈번한 데이터 조회 작업의 응답 시간을 줄일 수 있습니다.

### 3. 구체적인 캐싱 전략 및 Redis 도입 방안 작성

**캐싱 전략**:
- 각 엔드포인트별로 캐시 키를 설정하여 데이터를 캐싱합니다.
- 캐시 TTL(Time-To-Live)을 설정하여 일정 시간 후 캐시가 갱신되도록 합니다.

**Redis 도입 방안**:
- Redis에 캐시 데이터 저장
- Redis에서 데이터 조회 후 없으면 데이터베이스에서 조회하여 Redis에 저장

#### 구체적인 예제

**DatesController**:
```typescript
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { HttpCacheInterceptor } from './interceptors/http-cache.interceptor';
import { CacheKey } from '@nestjs/common';
import { CacheTTL } from '@nestjs/common';

@Controller('dates')
export class ConcertsController {

  @Get()
  @CacheKey('available-dates')
  @CacheTTL(3600) // 캐시 유효 시간 1시간
  @UseInterceptors(HttpCacheInterceptor)
  getAvailableDates(): Promise<ConcertDetail[]> {
    // 예약 가능한 날짜 목록 조회 로직
  }

  @Get(':concertDetailId')
  @CacheKey('available-seats')
  @CacheTTL(3600)
  @UseInterceptors(HttpCacheInterceptor)
  getAvailableSeats(@Param('concertDetailId') concertDetailId: number): Promise<Seat[]> {
    // 콘서트 예약 가능한 좌석 정보 조회 로직
  }
}
```

**ReservationsController**:
```typescript
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { HttpCacheInterceptor } from './interceptors/http-cache.interceptor';
import { CacheKey } from '@nestjs/common';
import { CacheTTL } from '@nestjs/common';

@Controller('reservations')
export class ReservationsController {

  @Get()
  @CacheKey('user-reservations')
  @CacheTTL(3600)
  @UseInterceptors(HttpCacheInterceptor)
  getUserReservations(@Req() req)  {
    // 유저 예약 목록 조회 로직
  }

  @Get(':id')
  @CacheKey('reservation-details')
  @CacheTTL(3600)
  @UseInterceptors(HttpCacheInterceptor)
  getReservationDetails(@Req() req, @Param('id') id: number) {
    // 특정 예약의 상세 정보 조회 로직
  }
}
```

### 4. 실행 계획 및 기대 효과 정리

**실행 계획**:
- 각 엔드포인트에 `HttpCacheInterceptor`를 적용하여 캐싱 로직 구현
- Redis를 설정하여 캐시 데이터 저장 및 조회 구현
- 캐시 TTL 설정을 통해 데이터 최신성 유지

**기대 효과**:
- 데이터베이스 조회 횟수 감소로 성능 향상
- 응답 시간 단축으로 사용자 경험 개선
- Redis를 활용한 빠른 데이터 조회로 시스템 부하 감소

### 요약

- **조회가 오래 걸리는 엔드포인트 식별**: `/dates`, `/dates/:concertDetailId`, `/reservations`, `/reservations/:id`
- **캐싱 대상 선정 및 전략 수립**: 자주 변경되지 않는 데이터를 대상으로 캐싱
- **Redis 도입 방안**: Redis에 캐시 데이터 저장 및 조회, 캐시 TTL 설정
- **실행 계획 및 기대 효과**: 캐시 적용 및 성능 개선 기대

이 문서를 기반으로 과제를 수행하고 필요한 추가 정보를 확인할 수 있습니다. 추가 질문이 있다면 알려주세요!
