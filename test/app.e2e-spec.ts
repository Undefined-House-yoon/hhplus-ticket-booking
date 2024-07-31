import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/token (POST) - 유저 토큰 발급', () => {
    return request(app.getHttpServer())
      .post('/token')
      .send({ userId: 1 })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data).toHaveProperty('expiredAt');
        // expect(res.body.data).toHaveProperty('queueInfo');
      });
  });


  it('/dates (GET) - 예약 가능 날짜 조회', async () => {
    const res = await request(app.getHttpServer())
      .post('/token')
      .send({ userId: 1 })
      .expect(200);

    token = res.body.data.token;

    return request(app.getHttpServer())
      .get('/dates')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/dates/:date/seats (GET) - 특정 날짜의 예약 가능한 좌석 정보 조회', () => {
    const date = '2024-08-01';

    return request(app.getHttpServer())
      .get(`/dates/${date}/seats`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        // expect(res.body.data).toHaveProperty('seats');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/reservations (POST) - 좌석 예약 요청', () => {
    const reservationData = {
      date: '2024-08-01',
      seatNumber: 1,
      token: token,
    };

    return request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send(reservationData)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('reservationId');
        expect(res.body.data).toHaveProperty('expiresIn');
      });
  });

  it('/balance (POST) - 잔액 충전', () => {
    const balanceData = {
      userId: 1,
      amount: 10000,
    };

    return request(app.getHttpServer())
      .post('/balance')
      .set('Authorization', `Bearer ${token}`)
      .send(balanceData)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('balance');
        expect(res.body.balance).toBeGreaterThanOrEqual(balanceData.amount);
      });
  });

  it('/balance (GET) - 잔액 조회', () => {
    return request(app.getHttpServer())
      .get('/balance')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('balance');
      });
  });

  it('/payment (POST) - 결제 처리', () => {
    const paymentData = {
      reservationId: 1, // 실제 예약 ID로 변경 필요
      userId: 1,
      amount: 10000,
    };

    return request(app.getHttpServer())
      .post('/payment')
      .set('Authorization', `Bearer ${token}`)
      .send(paymentData)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('transactionId');
      });
  });
});
