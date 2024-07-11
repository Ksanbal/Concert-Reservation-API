import { ConcertScheduleEntity } from 'src/4-infrastructure/concerts/entities/concert-schedule.entity';
import {
  ConcertSeatEntity,
  ConcertSeatStatusEnum,
} from 'src/4-infrastructure/concerts/entities/concert-seat.entity';
import { ConcertEntity } from 'src/4-infrastructure/concerts/entities/concert.entity';

export class ConcertsModel {
  constructor(
    public id: number,
    public name: string,
    public schedules: ConcertScheduleModel[] = [],
  ) {}

  static fromEntity(
    concert: ConcertEntity | null,
    schedules: ConcertScheduleEntity[],
  ) {
    if (concert == null) {
      return null;
    }

    return new ConcertsModel(
      concert.id,
      concert.name,
      schedules.map((schedule) => ConcertScheduleModel.fromEntity(schedule)),
    );
  }
}

export class ConcertScheduleModel {
  constructor(
    public id: number,
    public concertId: number,
    public date: Date,
    public ticketOpenAt: Date,
    public ticketCloseAt: Date,
    public leftSeat: number,
  ) {}

  static fromEntity(entity: ConcertScheduleEntity | null) {
    if (entity == null) {
      return null;
    }

    return new ConcertScheduleModel(
      entity.id,
      entity.concertId,
      entity.date,
      entity.ticketOpenAt,
      entity.ticketCloseAt,
      entity.leftSeat,
    );
  }
}

export class ConcertSeatsModel {
  constructor(
    public id: number,
    public concertScheduleId: number,
    public number: number,
    public price: number,
    public status: ConcertSeatStatusEnum,
  ) {}

  static fromEntity(entity: ConcertSeatEntity | null) {
    if (entity == null) {
      return null;
    }

    return new ConcertSeatsModel(
      entity.id,
      entity.concertScheduleId,
      entity.number,
      entity.price,
      entity.status,
    );
  }
}
