import { repl } from '@nestjs/core';
import { AppModule } from './app.module'; // AppModule의 경로를 프로젝트 구조에 맞게 수정

async function bootstrap() {
  await repl(AppModule);
}
bootstrap();
