import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertEntity } from './entities/concert.entity';
import { In, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { ConcertScheduleEntity } from './entities/concert-schedule.entity';
import { ConcertSeatEntity } from './entities/concert-seat.entity';
import {
  ConcertScheduleModel,
  ConcertSeatsModel,
  ConcertsModel,
} from 'src/3-domain/concerts/concerts.model';

@Injectable()
export class ConcertsRepository {
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,
    @InjectRepository(ConcertScheduleEntity)
    private readonly concertScheduleRepository: Repository<ConcertScheduleEntity>,
    @InjectRepository(ConcertSeatEntity)
    private readonly concertSeatRepository: Repository<ConcertSeatEntity>,
  ) {}

  async findAllWhereOpen(): Promise<ConcertsModel[]> {
    const concerts = await this.concertRepository.find();
    const schedules = await this.concertScheduleRepository.find({
      where: {
        concertId: In(concerts.map((concert) => concert.id)),
        ticketOpenAt: LessThanOrEqual(new Date()),
        ticketCloseAt: MoreThan(new Date()),
      },
    });

    return concerts.map((concert) => {
      const concertSchedules = schedules.filter(
        (schedule) => schedule.concertId === concert.id,
      );

      return ConcertsModel.fromEntity(concert, concertSchedules);
    });
  }

  async findScheduleById(id: number): Promise<ConcertScheduleModel | null> {
    return ConcertScheduleModel.fromEntity(
      await this.concertScheduleRepository.findOneBy({
        id,
      }),
    );
  }

  async findSeats(concertScheduleId: number): Promise<ConcertSeatsModel[]> {
    const entities = await this.concertSeatRepository.find({
      where: {
        concertScheduleId,
      },
    });

    return entities.map(ConcertSeatsModel.fromEntity);
  }
}
