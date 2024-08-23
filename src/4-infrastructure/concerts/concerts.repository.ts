import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertEntity } from './entities/concert.entity';
import {
  EntityManager,
  In,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm';
import { ConcertScheduleEntity } from './entities/concert-schedule.entity';
import {
  ConcertSeatEntity,
  ConcertSeatStatusEnum,
} from './entities/concert-seat.entity';
import {
  ConcertMetaDataModel,
  ConcertScheduleModel,
  ConcertSeatsModel,
  ConcertsModel,
} from 'src/3-domain/concerts/concerts.model';
import { ConcertMetaDataEntity } from './entities/concert-meta-data.entity';

@Injectable()
export class ConcertsRepository {
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,
    @InjectRepository(ConcertScheduleEntity)
    private readonly concertScheduleRepository: Repository<ConcertScheduleEntity>,
    @InjectRepository(ConcertSeatEntity)
    private readonly concertSeatRepository: Repository<ConcertSeatEntity>,
    @InjectRepository(ConcertMetaDataEntity)
    private readonly concertMeataDataRepository: Repository<ConcertMetaDataEntity>,
  ) {}

  async findAllWhereOpen(): Promise<ConcertsModel[]> {
    // const concerts = await this.concertRepository.find();
    const schedules = await this.concertScheduleRepository.find({
      where: {
        // concertId: In(concerts.map((concert) => concert.id)),
        ticketOpenAt: LessThanOrEqual(new Date()),
        ticketCloseAt: MoreThan(new Date()),
      },
    });
    const concertIds = schedules.map((schedule) => schedule.concertId);
    const concerts = await this.concertRepository.find({
      where: {
        id: In(concertIds),
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

  async findScheduleByIdWithTransaction(
    manager: EntityManager,
    id: number,
  ): Promise<ConcertScheduleModel | null> {
    return ConcertScheduleModel.fromEntity(
      await manager
        .createQueryBuilder(ConcertScheduleEntity, 'schedule')
        .setLock('pessimistic_write')
        .where('schedule.id = :id', { id })
        .getOne(),
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

  async findById(id: number): Promise<ConcertsModel | null> {
    return ConcertsModel.fromEntity(
      await this.concertRepository.findOne({
        where: { id },
      }),
      [],
    );
  }

  async findSeatById(id: number): Promise<ConcertSeatsModel | null> {
    return ConcertSeatsModel.fromEntity(
      await this.concertSeatRepository.findOne({
        where: { id },
      }),
    );
  }

  async createMetaData(args: {
    concert: ConcertsModel;
    concertSchedule: ConcertScheduleModel;
    concertSeat: ConcertSeatsModel;
  }): Promise<ConcertMetaDataModel | null> {
    const newEntity = this.concertMeataDataRepository.create({
      concertId: args.concert.id,
      concertName: args.concert.name,
      concertScheduleId: args.concertSchedule.id,
      concertScheduleDate: args.concertSchedule.date,
      concertSeatId: args.concertSeat.id,
      concertSeatNumber: args.concertSeat.number,
      concertSeatPrice: args.concertSeat.price,
    });

    return ConcertMetaDataModel.fromEntity(
      await this.concertMeataDataRepository.save(newEntity),
    );
  }

  async findSeatByIdWithTransaction(
    manager: EntityManager,
    seatId: number,
  ): Promise<ConcertSeatsModel> {
    return ConcertSeatsModel.fromEntity(
      await manager
        .createQueryBuilder(ConcertSeatEntity, 'seat')
        .setLock('pessimistic_write')
        .where('seat.id = :seatId', { seatId })
        .getOne(),
    );
  }

  async updateSeatStatus(manager: EntityManager, seat: ConcertSeatsModel) {
    await manager.save(ConcertSeatEntity, seat);
  }

  async updateScheduleLeftSeat(scheduleId: number, leftSeat: number) {
    await this.concertScheduleRepository.update(scheduleId, {
      leftSeat,
    });
  }

  async updateScheduleLeftSeatWithTransaction(
    manager: EntityManager,
    scheduleId: number,
    leftSeat: number,
  ) {
    // await this.concertScheduleRepository.update(scheduleId, {
    //   leftSeat,
    // });
    await manager.update(ConcertScheduleEntity, scheduleId, {
      leftSeat,
    });
  }

  // status가 reserved인 seatId의 상태를 open으로 변경
  async updateReservedSeatsToOpen(
    entityManager: EntityManager,
    seatIds: Array<number>,
  ): Promise<boolean> {
    const { affected } = await entityManager.update(
      ConcertSeatEntity,
      seatIds,
      {
        status: ConcertSeatStatusEnum.OPEN,
      },
    );
    return seatIds.length == affected;
  }

  // 콘서트 메타 데이터를 삭제
  async deleteConcertMetaData(
    entityManager: EntityManager,
    concertMetaDataIds: Array<number>,
  ): Promise<boolean> {
    const { affected } = await entityManager.delete(
      ConcertMetaDataEntity,
      concertMetaDataIds,
    );

    return concertMetaDataIds.length == affected;
  }

  async updateSeatStatusById(
    entityManager: EntityManager,
    seatId: number,
    status: ConcertSeatStatusEnum,
  ) {
    const { affected } = await entityManager.update(ConcertSeatEntity, seatId, {
      status,
    });

    return affected == 1;
  }
}
