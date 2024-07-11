import {
  ConcertScheduleModel,
  ConcertSeatsModel,
  ConcertsModel,
} from 'src/3-domain/concerts/concerts.model';
import { ConcertSeatStatusEnum } from 'src/4-infrastructure/concerts/entities/concert-seat.entity';

export class ConcertsMockRepository {
  concerts: ConcertsModel[] = [
    new ConcertsModel(1, '카리나의 첫 솔로 콘서트'),
    new ConcertsModel(2, '윈터의 첫 솔로 콘서트'),
  ];
  concertSchedules: ConcertScheduleModel[] = [
    new ConcertScheduleModel(
      1,
      1,
      new Date('2024-08-12T18:00:00'),
      new Date('2024-07-12T00:00:00'),
      new Date('2024-08-12T18:00:00'),
      0,
    ),
    new ConcertScheduleModel(
      2,
      1,
      new Date('2024-08-13T18:00:00'),
      new Date('2024-07-12T00:00:00'),
      new Date('2024-08-13T18:00:00'),
      50,
    ),
    new ConcertScheduleModel(
      3,
      2,
      new Date('2024-08-14T18:00:00'),
      new Date('2024-08-01T00:00:00'),
      new Date('2024-08-14T18:00:00'),
      50,
    ),
  ];
  concertSeats: ConcertSeatsModel[] = [
    ...Array.from(
      { length: 50 },
      (_, i) =>
        new ConcertSeatsModel(
          i + 1,
          1,
          i + 1,
          100000,
          ConcertSeatStatusEnum.SOLDOUT,
        ),
    ),
    ...Array.from(
      { length: 50 },
      (_, i) =>
        new ConcertSeatsModel(
          i + 1 + 50,
          2,
          i + 1,
          200000,
          ConcertSeatStatusEnum.OPEN,
        ),
    ),
    ...Array.from(
      { length: 50 },
      (_, i) =>
        new ConcertSeatsModel(
          i + 1 + 100,
          3,
          i + 1,
          300000,
          ConcertSeatStatusEnum.OPEN,
        ),
    ),
  ];

  async findAllWhereOpen(): Promise<ConcertsModel[]> {
    return this.concerts.map((concert) => {
      return new ConcertsModel(
        concert.id,
        concert.name,
        this.concertSchedules.filter(
          (schedule) =>
            schedule.concertId === concert.id &&
            0 < schedule.leftSeat &&
            schedule.ticketOpenAt <= new Date() &&
            schedule.ticketCloseAt > new Date(),
        ),
      );
    });
  }

  async findScheduleById(id: number): Promise<ConcertScheduleModel | null> {
    return this.concertSchedules.find((schedule) => schedule.id === id);
  }

  async findSeats(concertScheduleId: number): Promise<ConcertSeatsModel[]> {
    return this.concertSeats.filter(
      (seat) => seat.concertScheduleId === concertScheduleId,
    );
  }
}
