import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './1-presentation/queue/queue.module';
import { UsersModule } from './1-presentation/users/users.module';
import { PaymentsModule } from './1-presentation/payments/payments.module';
import { ConcertsModule } from './1-presentation/concerts/concerts.module';
import { ReservationsModule } from './1-presentation/reservations/reservations.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueEntity } from './3-domain/queue/entities/queue.entity';
import { UserEntity } from './3-domain/users/entities/user.entity';
import { PointEntity } from './3-domain/users/entities/point.entity';
import { PointHistoryEntity } from './3-domain/users/entities/point-history.entity';
import { ConcertEntity } from './3-domain/concerts/entities/concert.entity';
import { ConcertScheduleEntity } from './3-domain/concerts/entities/concert-schedule.entity';
import { ConcertSeatEntity } from './3-domain/concerts/entities/concert-seat.entity';
import { ConcertMetaDataEntity } from './3-domain/concerts/entities/concert-meta-data.entity';
import { ReservationEntity } from './3-domain/reservations/entities/reservation.entity';
import { PaymentEntity } from './3-domain/payments/entities/payment.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [
        UserEntity,
        PointEntity,
        PointHistoryEntity,
        QueueEntity,
        ConcertEntity,
        ConcertScheduleEntity,
        ConcertSeatEntity,
        ConcertMetaDataEntity,
        ReservationEntity,
        PaymentEntity,
      ],
      synchronize: true,
    }),
    QueueModule,
    UsersModule,
    PaymentsModule,
    ConcertsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
