1. **유저 토큰 발급 API**
   - **Endpoint**: `POST /token`
   - **Request**: `{ "userId": "PK" }`
   - **Response**: `{ "token": "JWT", "expiresIn": "1h", "queueInfo": { "position": 1, "waitTime": "5m" } }`
   - **Authorization**: 없음
   - **기능**: 유저의 PK와 대기열 정보를 포함한 토큰 발급

2. **예약 가능 날짜 / 좌석 API**
   - **Endpoint**: `GET /dates`
      - **Response**: `{ "dates": ["2024-07-01", "2024-07-02", ...] }`
      - **Authorization**: 필요
      - **기능**: 예약 가능한 날짜 목록 조회
   - **Endpoint**: `GET /dates/:date/seats`
      - **Response**: `{ "seats": [1, 2, 3, ..., 50] }`
      - **Authorization**: 필요
      - **기능**: 특정 날짜의 예약 가능한 좌석 정보 조회

3. **좌석 예약 요청 API**
   - **Endpoint**: `POST /reservations`
   - **Request**: `{ "date": "2024-07-01", "seatNumber": 1, "token": "JWT" }`
   - **Response**:
      - 성공: `{ "reservationId": "PK", "expiresIn": "5m" }`
      - 에러: `{ "error": "Seat is not available" }`, `{ "error": "Insufficient balance" }`
   - **Authorization**: 필요
   - **기능**: 날짜와 좌석 정보를 입력받아 좌석 예약, 임시 배정 및 시간 내 결제 관리

4. **잔액 충전 / 조회 API**
   - **Endpoint**: `POST /balance`
      - **Request**: `{ "userId": "PK", "amount": 10000 }`
      - **Response**: `{ "balance": 20000 }`
      - **Authorization**: 필요
      - **기능**: 유저의 잔액 충전
   - **Endpoint**: `GET /balance`
      - **Response**: `{ "balance": 20000 }`
      - **Authorization**: 필요 (JWT 토큰을 통해 사용자 인증)
      - **기능**: 유저의 잔액 조회

5. **결제 API**
   - **Endpoint**: `POST /payment`
   - **Request**: `{ "reservationId": "PK", "userId": "PK", "amount": 10000 }`
   - **Response**:
      - 성공: `{ "status": "success", "transactionId": "PK" }`
      - 에러: `{ "error": "Payment failed" }`
   - **Authorization**: 필요
   - **기능**: 결제 처리 및 결제 내역 생성, 좌석 소유권 배정, 대기열 토큰 만료
