import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';
import { ConcertsFacade } from 'src/2-application/concerts/concerts.facade';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { ConcertsRepository } from 'src/4-infrastructure/concerts/concerts.repository';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from 'src/4-infrastructure/concerts/entities/concert.entity';
import { QueueEntity } from 'src/4-infrastructure/queue/entities/queue.entity';
import { ConcertScheduleEntity } from 'src/4-infrastructure/concerts/entities/concert-schedule.entity';
import { ConcertSeatEntity } from 'src/4-infrastructure/concerts/entities/concert-seat.entity';
import { ConcertMetaDataEntity } from 'src/4-infrastructure/concerts/entities/concert-meta-data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConcertEntity,
      ConcertScheduleEntity,
      ConcertSeatEntity,
      ConcertMetaDataEntity,
      QueueEntity,
    ]),
  ],
  controllers: [ConcertsController],
  providers: [
    ConcertsFacade,
    ConcertsService,
    ConcertsRepository,
    QueueService,
    QueueRepository,
  ],
})
export class ConcertsModule {}
