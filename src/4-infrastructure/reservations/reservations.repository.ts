import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ReservationEntity,
  ReservationStatusEnum,
} from './entities/reservation.entity';
import { EntityManager, In, LessThanOrEqual, Repository } from 'typeorm';
import { ReservationsModel } from 'src/3-domain/reservations/reservations.model';
import { ConcertMetaDataEntity } from '../concerts/entities/concert-meta-data.entity';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(ConcertMetaDataEntity)
    private readonly concertMetaDataRepository: Repository<ConcertMetaDataEntity>,
  ) {}

  async create(args: {
    userId: number;
    concertMetaDataId: number;
    expiredAt: Date;
    status: ReservationStatusEnum;
  }): Promise<ReservationsModel> {
    const reservation = this.reservationRepository.create(args);

    return ReservationsModel.fromEntity(
      await this.reservationRepository.save(reservation),
      null,
    );
  }

  async findAllUnpaid(): Promise<ReservationsModel[]> {
    const reservations = await this.reservationRepository.find({
      where: {
        status: ReservationStatusEnum.RESERVED,
        expiredAt: LessThanOrEqual(new Date()),
      },
    });

    const concertMetaDatas = await this.concertMetaDataRepository.find({
      where: {
        id: In(reservations.map((e) => e.id)),
      },
    });

    return reservations.map((reservation) =>
      ReservationsModel.fromEntity(
        reservation,
        concertMetaDatas.find(
          (concertMetaData) =>
            concertMetaData.id == reservation.concertMetaDataId,
        ),
      ),
    );
  }

  async delete(
    entityManager: EntityManager,
    reservations: ReservationsModel[],
  ): Promise<boolean> {
    const { affected } = await entityManager.delete(
      ReservationEntity,
      reservations.map((e) => e.id),
    );

    return reservations.length == affected;
  }

  async findById(id: number): Promise<ReservationsModel> {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id,
      },
    });

    const concertMetaData = await this.concertMetaDataRepository.findOne({
      where: {
        id: reservation.concertMetaDataId,
      },
    });

    return ReservationsModel.fromEntity(reservation, concertMetaData);
  }

  async update(entityManager: EntityManager, reservation: ReservationsModel) {
    await entityManager.update(ReservationEntity, reservation.id, {
      status: reservation.status,
    });
  }
}
