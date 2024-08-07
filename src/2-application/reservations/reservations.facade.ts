import { Injectable } from '@nestjs/common';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { ReservationsService } from 'src/3-domain/reservations/reservations.service';
import { ReservationsFacadeCreateProps } from './reservations.facade-props';
import { DataSource, EntityManager } from 'typeorm';
import { QueueModel } from 'src/3-domain/queue/queue.model';

@Injectable()
export class ReservationsFacade {
  constructor(
    private readonly concertsService: ConcertsService,
    private readonly reservationsService: ReservationsService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 공연 좌석 예약
   */
  async create(queue: QueueModel, args: ReservationsFacadeCreateProps) {
    // 좌석 예약처리 요청
    await this.concertsService.reserveSeat(args.seatId);

    // 공연 meta data 생성
    const concertMetaData = await this.concertsService.createMetaData(
      args.scheduleId,
      args.seatId,
    );

    // 좌석 예약 정보 생성
    const newReservation = await this.reservationsService.create({
      userId: queue.userId,
      concertMetaDataId: concertMetaData.id,
    });
    newReservation.concertMetaData = concertMetaData;

    return newReservation;
  }

  /**
   * 공연 좌석 예약 반환 스케줄
   */
  async rollbackUnpaidReservations() {
    // 미결제 예약 정보 조회
    const reservations = await this.reservationsService.getUnpaidReservations();

    // 트랜잭션 시작
    try {
      await this.dataSource.transaction(
        async (entityManager: EntityManager) => {
          // 좌석 예약 반환 처리 & 공연 meta data 삭제
          const concertMetaDatas = reservations.map((e) => e.concertMetaData);
          await this.concertsService.rollbackReserved(
            entityManager,
            concertMetaDatas,
          );

          // 예약 정보 삭제
          await this.reservationsService.delete(entityManager, reservations);
        },
      );
    } catch (error) {
      console.error('공연 좌석 예약 반환 스케줄 중 트랜잭션 오류');
    }
  }
}
