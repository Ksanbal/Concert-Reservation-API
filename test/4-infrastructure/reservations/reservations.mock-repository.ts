import * as dayjs from 'dayjs';
import { ConcertMetaDataModel } from 'src/3-domain/concerts/concerts.model';
import { ReservationsModel } from 'src/3-domain/reservations/reservations.model';
import { ReservationStatusEnum } from 'src/4-infrastructure/reservations/entities/reservation.entity';

export class ReservationsMockRepository {
  mockData: ReservationsModel[] = [
    new ReservationsModel(
      1,
      new Date(),
      new Date(),
      dayjs().add(1, 'day').toDate(),
      1,
      ReservationStatusEnum.RESERVED,
      null,
    ),
  ];

  create = jest.fn(
    (args: {
      userId: number;
      concertMetaDataId: number;
      expiredAt: Date;
      status: ReservationStatusEnum;
    }) => {
      const model = new ReservationsModel(
        2,
        new Date(),
        new Date(),
        args.expiredAt,
        args.userId,
        args.status,
        new ConcertMetaDataModel(
          args.concertMetaDataId,
          1,
          'test',
          1,
          new Date(),
          1,
          1,
          1000,
        ),
      );
      this.mockData.push(model);

      return model;
    },
  );
}
