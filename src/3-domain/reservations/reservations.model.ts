import {
  ReservationEntity,
  ReservationStatusEnum,
} from 'src/4-infrastructure/reservations/entities/reservation.entity';
import { ConcertMetaDataModel } from '../concerts/concerts.model';
import { ConcertMetaDataEntity } from 'src/4-infrastructure/concerts/entities/concert-meta-data.entity';

export class ReservationsModel {
  constructor(
    public id: number,
    public createdAt: Date,
    public updatedAt: Date,
    public expiredAt: Date,
    public userId: number,
    public status: ReservationStatusEnum,
    public concertMetaData: ConcertMetaDataModel | null,
  ) {}

  static fromEntity(
    reservationEntity: ReservationEntity | null,
    concertMetaDataEntity: ConcertMetaDataEntity | null,
  ) {
    if (reservationEntity == null) {
      return null;
    }

    return new ReservationsModel(
      reservationEntity.id,
      reservationEntity.createdAt,
      reservationEntity.updatedAt,
      reservationEntity.expiredAt,
      reservationEntity.userId,
      reservationEntity.status,
      ConcertMetaDataModel.fromEntity(concertMetaDataEntity),
    );
  }
}
