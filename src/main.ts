import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './libs/filters/all-exception/all-exception.filter';
import { winstonLogger } from './libs/logger/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // winston logger 적용
    bufferLogs: true,
    logger: winstonLogger,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('콘서트 예약 API')
    .setDescription('포인트를 충전하고 콘서트의 좌석을 예매하는 API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Global Http 예외처리 필터
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(3000);
}
bootstrap();
