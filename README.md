# hhplus-ticket-booking 프로젝트

## 프로젝트 개요 및 범위 설정

콘서트 예약 서비스는 대기열 시스템을 통해 작업 가능한 유저만 예약을 수행할 수 있도록 합니다. 사용자는 좌석 예약 시 미리 충전한 잔액을 이용하며, 좌석 예약 요청 시 일정 시간 동안 다른 유저가 해당 좌석에 접근할 수 없도록 합니다.

---

## 시스템 아키텍트

### 시나리오별 요구사항 분석

1. **유저 토큰 발급**
    - 유저의 PK와 대기열 정보를 포함한 토큰 발급
2. **예약 가능 날짜 / 좌석 조회**
    - 예약 가능한 날짜 목록과 해당 날짜의 좌석 정보 조회
3. **좌석 예약 요청**
    - 날짜와 좌석 정보를 입력받아 좌석 예약, 임시 배정 및 시간 내 결제 관리
4. **잔액 충전 / 조회**
    - 유저의 잔액 충전 및 조회
5. **결제**
    - 결제 처리 및 결제 내역 생성, 좌석 소유권 배정, 대기열 토큰 만료

---

## 테스트 계획 수립

### 각 기능 및 제약사항에 대한 단위 테스트 계획 수립

#### 유저 토큰 발급 API
- 정상적인 토큰 발급 테스트
- 잘못된 유저 ID로 요청 시 에러 응답 테스트

#### 예약 가능 날짜 / 좌석 API
- 예약 가능한 날짜 목록 조회 테스트
- 특정 날짜의 좌석 정보 조회 테스트
- 인증되지 않은 요청 시 에러 응답 테스트

#### 좌석 예약 요청 API
- 정상적인 좌석 예약 요청 테스트
- 이미 예약된 좌석에 대한 중복 예약 요청 시 에러 응답 테스트
- 임시 배정 시간 내에 결제되지 않은 경우 좌석 해제 테스트

#### 잔액 충전 / 조회 API
- 정상적인 잔액 충전 및 조회 테스트
- 잘못된 유저 ID로 요청 시 에러 응답 테스트

#### 결제 API
- 정상적인 결제 처리 테스트
- 잔액 부족 시 에러 응답 테스트
- 인증되지 않은 요청 시 에러 응답 테스트

---

## 주요 순차도 
[주요 시퀀스 다이어그램 모음](sequence_diagrams.md)

## 데이터베이스 테이블 설명
[ERD Table](erd_table.md)


스케줄러로 관리.;;
