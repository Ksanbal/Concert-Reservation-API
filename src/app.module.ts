import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './1-presentation/queue/queue.module';
import { UsersModule } from './1-presentation/users/users.module';
import { PaymentsModule } from './1-presentation/payments/payments.module';
import { ConcertsModule } from './1-presentation/concerts/concerts.module';
import { ReservationsModule } from './1-presentation/reservations/reservations.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './libs/database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerContextMiddleware } from './libs/middleware/logger-context.middleware';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    QueueModule,
    UsersModule,
    PaymentsModule,
    ConcertsModule,
    ReservationsModule,
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
