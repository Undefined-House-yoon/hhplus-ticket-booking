import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe  } from '@nestjs/common';
import { CombinedExceptionFilter } from './api/middlewares/filter/exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('콘서트 티케팅 예약')
    .setDescription('콘서트 티케팅 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Kafka 마이크로서비스 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9093', 'localhost:9094', 'localhost:9095'], // Kafka 브로커 주소
      },
      consumer: {
        groupId: 'my-groupd', // Kafka consumer group ID'
      },
    },
  });

  // 모든 마이크로서비스 시작
  await app.startAllMicroservices();

  // HTTP 서버 시작
  await app.listen(3000);
}

bootstrap();

