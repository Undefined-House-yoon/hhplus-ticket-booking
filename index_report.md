# Index 추가 성능개선 (README)

## 개요
이 프로젝트는 유저 토큰 발급, 대기열 관리, 콘서트 예약 시스템을 구현합니다. 아래 시나리오를 통해 다양한 API 호출을 수행하며, 각 API의 성능을 개선하기 위한 데이터베이스 인덱스 설계를 포함합니다.
## API 명세서

API 명세서는 아래 링크에서 확인할 수 있습니다:

[API 명세서 보기](API명세.md)

## 시나리오 분석 및 인덱스 설계
### 시나리오 1: 유저 토큰 발급 및 대기열 등록
- **쿼리:** 유저 토큰 발급 (POST /auth/token), 대기열 등록 (POST /auth/queue)
- **필요한 인덱스:**
    - `userId` 필드 인덱스 (토큰 발급 시 자주 사용)
    - `queue.position` 필드 인덱스 (대기열 조회 시 자주 사용)

### 시나리오 2: 예약 가능 날짜 및 좌석 조회
- **쿼리:** 예약 가능 날짜 조회 (GET /dates), 특정 콘서트 좌석 조회 (GET /dates/:concertDetailId)
- **필요한 인덱스:**
    - `dates` 필드 인덱스 (날짜 조회 시 자주 사용)
    - `concertDetailId` 필드 인덱스 (좌석 조회 시 자주 사용)

### 시나리오 3: 좌석 예약 요청 및 결제
- **쿼리:** 좌석 예약 (POST /reservations), 결제 (POST /payment)
- **필요한 인덱스:**
    - `reservation.concertDetailId` 필드 인덱스 (좌석 예약 시 자주 사용)
    - `payment.reservationId` 필드 인덱스 (결제 시 자주 사용)

## 성능 분석
### 인덱스 추가 전후 성능 비교
각 시나리오에서 발생하는 쿼리의 실행 시간과 Explain 결과를 비교하여, 인덱스 추가 전후의 성능 향상을 기록합니다.

#### 시나리오 1: 유저 토큰 발급 및 대기열 등록
- **쿼리:** `SELECT * FROM QueueItem WHERE user_id  = ?`
- **인덱스 추가 전:**
    - 실행 시간: 0.427 ms
    - Explain 결과: Index Scan using "QueueItem_user_id_key" on "QueueItem"
- **인덱스 추가 후:**
    - 실행 시간: 0.030 ms
    - Explain 결과: Index Scan using idx_queue_item_user_id on "QueueItem"

| 시나리오       | 인덱스 추가 전 실행 시간 | 인덱스 추가 후 실행 시간 | 성능 향상 |
|---------------|----------------|------------------------|-------|
| 유저 토큰 발급  | 0.427ms          | 0.030ms                   | 14 배  |

#### 시나리오 2: 예약 가능 날짜 및 좌석 조회
- **쿼리:** `SELECT * FROM ConcertDetail WHERE concert_id = ? AND date = '2024-07-01' `
- **인덱스 추가 전:**
    - 실행 시간: 0.274 ms
    - Explain 결과: Seq Scan on "ConcertDetail"
- **인덱스 추가 후:**
    - 실행 시간: 0.022 ms
    - Explain 결과: Index Scan using idx_concert_detail_concert_id_date on "ConcertDetail"

  
- **쿼리:** `SELECT * FROM "Seat"  WHERE concert_detail_id = ? AND status = 'available'; `
- **인덱스 추가 전:**
  - 실행 시간: 1.521 ms
  - Explain 결과: Seq Scan on "Seat"
- **인덱스 추가 후:**
  - 실행 시간: 0.031 ms
  - Explain 결과: Index Scan using idx_seat_concert_detail_id_status on "Seat"

| 시나리오        | 인덱스 추가 전 실행 시간 | 인덱스 추가 후 실행 시간 | 성능 향상 |
|-------------|------------------------|------------------------|-------|
| 예약 가능 날짜 조회 | 0.274 ms                 |0.022 ms                 | 12 배  |
| 예약 가능 좌석 조회 | 1.521 ms                 |0.031 ms                | 50 배  |

#### 시나리오 3: 좌석 예약 요청 및 결제
- **쿼리:** `SELECT * FROM "Reservation" WHERE user_id = ? AND status = 'pending'`
- **인덱스 추가 전:**
    - 실행 시간: 0.268 ms
    - Explain 결과: Seq Scan on "Reservation"
- **인덱스 추가 후:**
    - 실행 시간: 0.025 ms
    - Explain 결과: IIndex Scan using idx_reservation_user_id_status on "Reservation"

- **쿼리:** `SELECT * FROM "Payment" WHERE status = 'paid';'`
- **인덱스 추가 전:**
  - 실행 시간: 0.268 ms
  - Explain 결과: Seq Scan on "Payment"
- **인덱스 추가 후:**
  - 실행 시간: 0.025 ms
  - Explain 결과: Bitmap Index Scan on idx_payment_status

| 시나리오     | 인덱스 추가 전 실행 시간 | 인덱스 추가 후 실행 시간 | 성능 향상 |
|----------|------------------------|------------------------|-------|
| 좌석 예약 요청 | 0.268 ms                  | 0.025 ms                   | 11 배  |
| 결제 요청    | 0.254 ms                 | 0.128 ms                | 2 배   |


- **성능 향상 배수 계산 방법**
- 성능 향상 배수는 인덱스 추가 전 실행 시간을 인덱스 추가 후 실행 시간으로 나눈 값으로 계산됩니다.
  - 유저 토큰 발급: 0.427 ms / 0.030 ms = 14.23배
  - 예약 가능 날짜 조회: 0.274 ms / 0.022 ms = 12.45배
  - 예약 가능 좌석 조회: 1.521 ms / 0.031 ms = 49.06배
  - 좌석 예약 요청: 0.268 ms / 0.025 ms = 10.72배
  - 결제 요청: 0.254 ms / 0.128 ms = 1.98배


## 결론
실제 성능 분석 결과에 따르면, 인덱스 적용 전후 쿼리 실행 시간이 크게 감소하였으며, 
특히 예약 가능 좌석 조회의 경우 49배 이상의 성능 향상을 이루어냈습니다. 
이러한 최적화는 시스템의 반응 속도를 높이고, 대규모 데이터셋에서도 안정적인 성능을 유지하는 데 중요한 역할을 합니다.

성능 분석 표를 통해 확인된 바와 같이, 인덱스 추가를 통해 각 시나리오에서 쿼리 성능이 크게 개선되었습니다. 
이는 데이터베이스 최적화의 중요성을 다시 한번 강조하며, 
효율적인 데이터베이스 설계를 통해 사용자의 경험을 향상시키는 데 기여할 수 있음을 보여줍니다.
