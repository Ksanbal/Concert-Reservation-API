import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsFacade } from 'src/2-application/payments/payments.facade';
import { PaymentsService } from 'src/3-domain/payments/payments.service';
import { PaymentsRepository } from 'src/4-infrastructure/payments/payments.repository';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { ReservationsService } from 'src/3-domain/reservations/reservations.service';
import { UsersService } from 'src/3-domain/users/users.service';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { ReservationsRepository } from 'src/4-infrastructure/reservations/reservations.repository';
import { UsersRepository } from 'src/4-infrastructure/users/users.repository';
import { ConcertsRepository } from 'src/4-infrastructure/concerts/concerts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/4-infrastructure/payments/entities/payment.entity';
import { QueueEntity } from 'src/4-infrastructure/queue/entities/queue.entity';
import { ReservationEntity } from 'src/4-infrastructure/reservations/entities/reservation.entity';
import { ConcertMetaDataEntity } from 'src/4-infrastructure/concerts/entities/concert-meta-data.entity';
import { UserEntity } from 'src/4-infrastructure/users/entities/user.entity';
import { PointEntity } from 'src/4-infrastructure/users/entities/point.entity';
import { ConcertEntity } from 'src/4-infrastructure/concerts/entities/concert.entity';
import { ConcertSeatEntity } from 'src/4-infrastructure/concerts/entities/concert-seat.entity';
import { ConcertScheduleEntity } from 'src/4-infrastructure/concerts/entities/concert-schedule.entity';
import { ProducerService } from 'src/libs/message-broker/producer.service';
import { PaymentsEvent } from 'src/events/payments/payments.event';
import { ConsumerService } from 'src/libs/message-broker/consumer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      QueueEntity,
      ReservationEntity,
      ConcertMetaDataEntity,
      UserEntity,
      PointEntity,
      ConcertEntity,
      ConcertScheduleEntity,
      ConcertSeatEntity,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsFacade,
    PaymentsService,
    PaymentsRepository,
    QueueService,
    QueueRepository,
    ReservationsService,
    ReservationsRepository,
    UsersService,
    UsersRepository,
    ConcertsService,
    ConcertsRepository,
    ProducerService,
    ConsumerService,
    PaymentsEvent,
  ],
})
export class PaymentsModule {}
