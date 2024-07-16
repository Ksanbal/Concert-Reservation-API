import { Injectable } from '@nestjs/common';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { ReservationsService } from 'src/3-domain/reservations/reservations.service';
import { ReservationsFacadeCreateProps } from './reservations.facade-props';

@Injectable()
export class ReservationsFacade {
  constructor(
    private readonly queueService: QueueService,
    private readonly concertsService: ConcertsService,
    private readonly reservationsService: ReservationsService,
  ) {}

  /**
   * 공연 좌석 예약
   */
  async create(token: string, args: ReservationsFacadeCreateProps) {
    // 토큰 유효성 체크
    const queue = await this.queueService.getWorking({ token });

    // 좌석 예약처리 요청
    await this.concertsService.reserveSeat(args.seatId);

    // 공연 meta data 생성
    const concertMetaData = await this.concertsService.createMetaData(
      args.scheduleId,
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

    for (const reservation of reservations) {
      // 좌석 예약 반환 처리
      try {
        await this.concertsService.rollbackSeat(
          reservation.concertMetaData.concertSeatId,
        );

        // 예약 정보 삭제
        await this.reservationsService.delete(reservation.id);

        // 공연 meta data 삭제
        await this.concertsService.deleteMetaData(
          reservation.concertMetaData.id,
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
}
