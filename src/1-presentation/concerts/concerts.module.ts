import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';
import { ConcertsFacade } from 'src/2-application/concerts/concerts.facade';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { ConcertsRepository } from 'src/4-infrastructure/concerts/concerts.repository';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from 'src/4-infrastructure/concerts/entities/concert.entity';
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
    ]),
  ],
  controllers: [ConcertsController],
  providers: [ConcertsFacade, ConcertsService, ConcertsRepository],
})
export class ConcertsModule {}
