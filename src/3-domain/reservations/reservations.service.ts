import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationsRepository } from 'src/4-infrastructure/reservations/reservations.repository';
import { ReservationsModel } from './reservations.model';
import { ReservationsCreateProps } from './reservations.props';
import * as dayjs from 'dayjs';
import { ReservationStatusEnum } from 'src/4-infrastructure/reservations/entities/reservation.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  async create(args: ReservationsCreateProps): Promise<ReservationsModel> {
    return this.reservationsRepository.create({
      userId: args.userId,
      concertMetaDataId: args.concertMetaDataId,
      expiredAt: dayjs().add(10, 'minute').toDate(),
      status: ReservationStatusEnum.RESERVED,
    });
  }

  async getUnpaidReservations(): Promise<ReservationsModel[]> {
    return this.reservationsRepository.findAllUnpaid();
  }

  async delete(
    entityManager: EntityManager,
    reservations: ReservationsModel[],
  ) {
    const result = await this.reservationsRepository.delete(
      entityManager,
      reservations,
    );
    if (result == false) {
      throw new Error('예약 삭제 실패');
    }
  }

  async get(id: number): Promise<ReservationsModel> {
    const reservation = await this.reservationsRepository.findById(id);
    if (reservation == null) {
      throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
    }

    return reservation;
  }

  async payReservation(
    entityManager: EntityManager,
    reservation: ReservationsModel,
  ): Promise<ReservationsModel> {
    reservation.status = ReservationStatusEnum.PAID;
    return await this.reservationsRepository.update(entityManager, reservation);
  }
}
