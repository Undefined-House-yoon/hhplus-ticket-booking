import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Redis 서버 호스트명
      port: 6379,        // Redis 서버 포트
      ttl: 60 * 60,      // 기본 캐시 TTL (1시간)
    }),
  ],
})
export class RedisCacheModule {}
