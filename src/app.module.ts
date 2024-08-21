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
import { MyRedisModule } from './libs/redis/redis.module';
import { QueueGuardModule } from './libs/guards/queue/queue-guard.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './1-presentation/notifications/notifications.module';
import { ProducerService } from './libs/message-broker/producer.service';
import { ConsumerService } from './libs/message-broker/consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    QueueModule,
    UsersModule,
    PaymentsModule,
    ConcertsModule,
    ReservationsModule,
    MyRedisModule,
    QueueGuardModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, ProducerService, ConsumerService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
