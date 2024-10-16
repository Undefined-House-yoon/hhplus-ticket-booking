#### 초안

1. **API 명세 작성**
    - **유저 토큰 발급 API**
        - Endpoint: `POST /token`
        - Request: `{ "userId": "PK" }`
        - Response: `{ "token": "JWT", "queueInfo": { "position": 1, "waitTime": "5m" } }`
        - Authorization: 없음
        - 기능 : 유저의 PK 와 대기열 정보를 포함한 토큰 발급
      
    - **예약 가능 날짜 / 좌석 API**
        - Endpoint: `GET /dates`
        - Response: `{ "dates": ["2024-07-01", "2024-07-02", ...] }`
        - Endpoint: `GET /dates/:date/seats`
        - Response: `{ "seats": [1, 2, 3, ..., 50] }`
        - Authorization: 필요
        - 기능 : 예약 가능한 날짜 목록과 해당 날짜의 좌석 정보 조회
      
    - **좌석 예약 요청 API**
        - Endpoint: `POST /reservations`
        - Request: `{ "date": "2024-07-01", "seatNumber": 1, "token": "JWT" }`
        - Response: `{ "reservationId": "PK", "expiresIn": "5m" }`
        - Authorization: 필요
        - 기능 : 날짜와 좌석 정보를 입력받아 좌석 예약, 임시 배정 및 시간 내 결제 관리
      
    - **예약 상세 정보 조회 API**
        - Endpoint: `GET /reservations/:id`
        - Response: `ReservationDetailResponse` (예약 ID, 사용자 ID, 날짜, 좌석 번호, 상태, 생성 시간, 만료 시간 포함)
        - Authorization: 필요
        - 기능: 특정 예약의 상세 정보 조회
      
    - **예약 취소 API**
        - Endpoint: `DELETE /reservations/:id`
        - Response: `{ status: string }`
        - Authorization: 필요
        -  기능: 특정 예약 취소
      
    - **잔액 충전 / 조회 API**
        - Endpoint: `POST /balance`
        - Request: `{ "userId": "PK", "amount": 10000 }`
        - Response: `{ "balance": 20000 }`
        - Authorization: 필요
        - Endpoint: `GET /balance`
        - Request: `{ "userId": "PK" }`
        - Response: `{ "balance": 20000 }`
        - Authorization: 필요
        - 기능 : 유저의 잔액 충전 및 조회
      
    - **결제 API**
        - Endpoint: `POST /payment`
        - Request: `{ "reservationId": "PK", "userId": "PK", "amount": 10000 }`
        - Response: `{ "status": "success", "transactionId": "PK" }`
        - Authorization: 필요
        - 기능 : 결제 처리 및 결제 내역 생성, 좌석 소유권 배정, 대기열 토큰 만료
      
    - **환불 처리 API**
        - Endpoint: `POST /refunds`
        - Request: `{ reservationId: string }`
        - Response: `RefundResponse` (환불 ID, 금액, 상태 포함)
        - Authorization: 필요
        - 기능: 취소된 예약에 대한 환불 처리

    - **좌석 정보 상세 조회 API**
        - Endpoint: `GET /seats/:id`
        - Response: `SeatDetailResponse` (좌석 ID, 번호, 상태, 가격 포함)
        - Authorization: 필요
        - 기능: 특정 좌석의 상세 정보 조회
      
    - **결제 내역 조회 API**
        - Endpoint: `GET /payments`
        - Query Parameters: `userId`, `page`, `limit`
        - Response: `{ payments: PaymentResponse[], total: number }`
        - Authorization: 필요
        - 기능: 사용자의 결제 내역 조회 (페이지네이션 적용)
