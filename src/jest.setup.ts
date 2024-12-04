import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // 데이터베이스 초기화
  await prisma.$executeRaw`TRUNCATE TABLE "QueueItem" CASCADE`;
  await prisma.$executeRaw`ALTER SEQUENCE "QueueItem_id_seq" RESTART WITH 1`;
  // await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;

});

afterAll(async () => {
  // Prisma 클라이언트 종료
  await prisma.$disconnect();
});
