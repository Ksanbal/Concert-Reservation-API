import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ReservationEntity,
  ReservationStatusEnum,
} from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { ReservationsModel } from 'src/3-domain/reservations/reservations.model';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
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
}
