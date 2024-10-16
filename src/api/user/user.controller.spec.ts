import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppModule } from '../../app.module';

describe('UserController (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // 테스트 전 데이터베이스 초기화
    await prisma.user.deleteMany();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ userId: 1, amount: 10000 })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.userId).toBe(1);
        expect(res.body.data.amount).toBe(10000);
      });
  });

  // it('/users/:id (GET)', async () => {
  //   // 먼저 사용자를 생성
  //   await prisma.user.create({
  //     data: {
  //       id: 1,
  //       balance: 100,
  //     },
  //   });
  //
  //   return request(app.getHttpServer())
  //     .get('/users/1')
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.id).toBe(1);
  //       expect(res.body.balance).toBe(100);
  //     });
  // });
});
