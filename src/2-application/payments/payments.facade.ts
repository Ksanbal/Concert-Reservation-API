import { ConflictException, Injectable } from '@nestjs/common';
import { PaymentsPayReqDto } from 'src/1-presentation/payments/dto/request/payments.pay.req.dto';
import { PaymentsModel } from 'src/3-domain/payments/payments.model';
import { PaymentsService } from 'src/3-domain/payments/payments.service';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import { ReservationsService } from 'src/3-domain/reservations/reservations.service';
import { UsersService } from 'src/3-domain/users/users.service';
import {
  PaymentsPaiedErrorEventDto,
  PaymentsPaiedEvenDto,
} from 'src/events/payments/dto/payments.event.dto';

import { ProducerService } from 'src/libs/message-broker/producer.service';
import { DataSource, EntityManager } from 'typeorm';
import { log } from 'winston';

@Injectable()
export class PaymentsFacade {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService,
    private readonly dataSource: DataSource,
    private readonly producerServcie: ProducerService,
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

        // 결제 outbox 생성
        await this.paymentsService.createOutbox(entityManager, {
          payment,
          topic: PaymentsPaiedEvenDto.EVENT_NAME,
          key: payment.id.toString(),
          value: JSON.stringify(
            new PaymentsPaiedEvenDto(queue, payment, reservation),
          ),
        });
      })
      .catch((error) => {
        log('error', '결제 처리 중 트랜잭션 오류', error);
        throw new ConflictException(error);
      });

    // 결제 완료 이벤트 발행
    this.producerServcie.produce({
      topic: PaymentsPaiedEvenDto.EVENT_NAME,
      messages: [
        {
          key: payment.id.toString(),
          value: JSON.stringify(
            new PaymentsPaiedEvenDto(queue, payment, reservation),
          ),
        },
      ],
    });

    // 결제 정보 반환
    return payment;
  }

  /**
   * 결제 실패시 결제 정보 롤백
   */
  async rollbackPayment(event: PaymentsPaiedErrorEventDto) {
    const { payment, reservation } = event;

    await this.dataSource
      .transaction(async (entityManager: EntityManager) => {
        // 사용자 포인트 환불
        await this.usersService.refund(
          entityManager,
          payment.userId,
          reservation.concertMetaData.concertSeatPrice,
        );

        // 결제 내역 삭제
        await this.paymentsService.delete(entityManager, payment);
      })
      .catch((error) => {
        log('error', '결제 롤백 중 트랜잭션 오류', error);
        throw new ConflictException(error);
      });
  }

  /**
   * 발행 실패한 결제 outbox 재발행
   */
  async publishOutbox() {
    // 미발행 outbox 조회
    const outboxes = await this.paymentsService.getUnpublishedOutboxs();

    if (0 < outboxes.length) {
      // outbox 재발행
      this.producerServcie.produce({
        topic: outboxes[0].topic,
        messages: outboxes.map((outbox) => ({
          key: outbox.key,
          value: outbox.value,
        })),
      });
    }
  }
}
