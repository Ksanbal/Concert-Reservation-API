import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsFacade } from 'src/2-application/reservations/reservations.facade';
import { ReservationsService } from 'src/3-domain/reservations/reservations.service';
import { ReservationsRepository } from 'src/4-infrastructure/reservations/reservations.repository';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { ConcertsRepository } from 'src/4-infrastructure/concerts/concerts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from 'src/4-infrastructure/reservations/entities/reservation.entity';
import { ConcertMetaDataEntity } from 'src/4-infrastructure/concerts/entities/concert-meta-data.entity';
import { QueueEntity } from 'src/4-infrastructure/queue/entities/queue.entity';
import { ConcertEntity } from 'src/4-infrastructure/concerts/entities/concert.entity';
import { ConcertScheduleEntity } from 'src/4-infrastructure/concerts/entities/concert-schedule.entity';
import { ConcertSeatEntity } from 'src/4-infrastructure/concerts/entities/concert-seat.entity';
import { ReservationsListener } from './listener/reservations.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReservationEntity,
      ConcertMetaDataEntity,
      QueueEntity,
      ConcertEntity,
      ConcertScheduleEntity,
      ConcertSeatEntity,
    ]),
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsListener,
    ReservationsFacade,
    ReservationsService,
    ReservationsRepository,
    QueueService,
    QueueRepository,
    ConcertsService,
    ConcertsRepository,
  ],
})
export class ReservationsModule {}
