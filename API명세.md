1. **유저 토큰 발급 API**
   - **Endpoint**: `POST /auth/token`
     - **Request**: `{ "userId": "PK" }`
     - **Response**: `{ "token": "JWT", "expiresIn": "1h", "queueInfo": { "position": 1, "waitTime": "5m" } }`
     - **Authorization**: 없음
     - **기능**: 유저의 PK와 대기열 정보를 포함한 토큰 발급

2. 대기열 등록 API
   - **Endpoint**: `POST /auth/queue`
       - **Response**:
         ```json
         {
           "status": "false",
           "position": 1
         }
         ```
       - **Authorization**: JWT
       - **기능**: 유저를 대기열에 등록하고 대기열 위치와 

3. 대기열 상태 조회 API
   - **Endpoint**: `GET /auth/queue`
       - **Response**:
         ```json
         {
           "status": "false || true",
           "position": 1
         }
         ```
       - **Authorization**: JWT
       - **기능**: 유저의 대기열 상태와 대기열 위치

4. **예약 가능 날짜 / 좌석 API**
   - **Endpoint**: `GET /dates`
      - **Response**: 
        ```json 
        { "dates": ["2024-07-01", "2024-07-02", "..."] }
        ```
      - **Authorization**: 필요
      - **기능**: 예약 가능한 날짜 목록 조회 0
   - **Endpoint**: `GET /dates/:concertDetailId`
      - **Response**: `{ "seats": [1, 2, 3, ..., 50] }`
      - **Authorization**: 필요
      - **기능**: 콘서트 예약 가능한 좌석 정보 조회

5. **좌석 예약 요청 API**
   - **Endpoint**: `POST /reservations`
     - **Request**: `{ "concertDetailId": PK, "seatNumber": 1, "token": "JWT" }`
     - **Response**:
        - 성공: `{ "reservation": /* 예약 내역 */, "expiresIn": "5m" }`
        - 에러: `{ "error": "Seat is not available" }`, `{ "error": "Insufficient balance" }`
     - **Authorization**: 필요
     - **기능**: 콘서트 정보와 좌석 정보를 입력받아 좌석 예약, 임시 배정 및 시간 내 결제 관리

6. **유저 예약 목록 조회 API**
    - **Endpoint**: `GET /reservations`
      - **Authorization**: 필요
      - **Request**: 없음
      - **Response**:
          - 성공: `{ "reservations": [ /* 예약 목록 */ ] }`
          - 에러: `{ "error": "Unauthorized request" }`
      - **기능**: 사용자의 예약 목록을 조회합니다.

7. 특정 예약 상세 정보 조회 API
   - **Endpoint**: `GET /reservations/:id`
     - **Authorization**: 필요
     - **Request**: 없음
     - **Response**:
         - 성공: `{ "reservation": { /* 예약 상세 정보 */ } }`
         - 에러: `{ "error": "Unauthorized request" }`, `{ "error": "Forbidden" }`, `{ "error": "Reservation not found" }`
     - **기능**: 특정 예약의 상세 정보를 조회합니다.

8. 예약 취소 API
   - **Endpoint**: `DELETE /reservations/:id`
     - **Authorization**: 필요
     - **Request**: 없음
     - **Response**:
         - 성공: `{ "message": "Reservation cancelled successfully" }`
         - 에러: `{ "error": "Unauthorized request" }`, `{ "error": "Forbidden" }`, `{ "error": "Reservation not found" }`
     - **기능**: 예약을 취소합니다.

9. **환불 처리 API**
   - **Endpoint**: `POST /refunds`
     - **Authorization**: 필요
     - **Request**: `{ "reservationId": PK, "reason": "string" }`
     - **Response**:
         - 성공: `{ "message": "Refund processed successfully" }`
         - 에러: `{ "error": "Unauthorized request" }`, `{ "error": "Invalid reservation" }`, `{ "error": "Refund not possible" }`
     - **기능**: 환불을 처리합니다.

10. **잔액 충전 / 조회 API**
    - **Endpoint**: `GET /balance`
      - **Response**: `{ "balance": 20000 }`
      - **Authorization**: 필요 (JWT 토큰을 통해 사용자 인증)
      - **기능**: 유저의 잔액 조회
    - **Endpoint**: `POST /balance`
       - **Request**: `{ "userId": "PK", "amount": 10000 }`
       - **Response**: `{ "balance": 20000 }`
       - **Authorization**: 필요
       - **기능**: 유저의 잔액 충전

11. **결제 API**
    - **Endpoint**: `POST /payment`
      - **Request**: `{ "reservationId": "PK", "userId": "PK", "amount": 10000 }`
      - **Response**:
         - 성공: `{ "status": "success", "transactionId": "PK" }`
         - 에러: `{ "error": "Payment failed" }`
        - **Authorization**: 필요
        - **기능**: 결제 처리 및 결제 내역 생성, 좌석 소유권 배정, 대기열 토큰 만료
