import { ConflictException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentsPayReqDto } from 'src/1-presentation/payments/dto/request/payments.pay.req.dto';
import { PaymentsModel } from 'src/3-domain/payments/payments.model';
import { PaymentsService } from 'src/3-domain/payments/payments.service';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import { ReservationsService } from 'src/3-domain/reservations/reservations.service';
import { UsersService } from 'src/3-domain/users/users.service';
import { PaymentsPaiedEvent } from 'src/events/event';
import { DataSource, EntityManager } from 'typeorm';
import { log } from 'winston';

@Injectable()
export class PaymentsFacade {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async payReservation(
    queue: QueueModel,
    dto: PaymentsPayReqDto,
  ): Promise<PaymentsModel> {
    // 예약정보 조회
    const { reservationId } = dto;
    const reservation = await this.reservationsService.get(reservationId);

    let payment;

    // 트랜잭션 시작
    await this.dataSource
      .transaction(async (entityManager: EntityManager) => {
        // 사용자 포인트 차감 요청
        await this.usersService.use(
          entityManager,
          queue.userId,
          reservation.concertMetaData.concertSeatPrice,
        );

        // 결제 내역 생성
        payment = await this.paymentsService.create(
          entityManager,
          reservation.id,
          reservation.userId,
        );
      })
      .catch((error) => {
        log('error', '결제 처리 중 트랜잭션 오류', error);
        throw new ConflictException(error);
      });

    // 결제 완료 이벤트 발행
    this.eventEmitter.emitAsync(
      PaymentsPaiedEvent.EVENT_NAME,
      new PaymentsPaiedEvent(queue, payment, reservation),
    );

    // 결제 정보 반환
    return payment;
  }
}
