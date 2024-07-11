import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertMetaDataEntity } from 'src/4-infrastructure/concerts/entities/concert-meta-data.entity';
import { ConcertScheduleEntity } from 'src/4-infrastructure/concerts/entities/concert-schedule.entity';
import { ConcertSeatEntity } from 'src/4-infrastructure/concerts/entities/concert-seat.entity';
import { ConcertEntity } from 'src/4-infrastructure/concerts/entities/concert.entity';
import { PaymentEntity } from 'src/4-infrastructure/payments/entities/payment.entity';
import { QueueEntity } from 'src/4-infrastructure/queue/entities/queue.entity';
import { ReservationEntity } from 'src/4-infrastructure/reservations/entities/reservation.entity';
import { PointHistoryEntity } from 'src/4-infrastructure/users/entities/point-history.entity';
import { PointEntity } from 'src/4-infrastructure/users/entities/point.entity';
import { UserEntity } from 'src/4-infrastructure/users/entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule을 임포트합니다.
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        namingStrategy: new SnakeNamingStrategy(),
        entities: [
          /* 엔티티 목록 */
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
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true', // 환경 변수를 boolean으로 변환
      }),
      inject: [ConfigService], // ConfigService를 주입합니다.
    }),
  ],
})
export class DatabaseModule {}
