import { ConflictException, Injectable } from '@nestjs/common';
import { PaymentsPayReqDto } from 'src/1-presentation/payments/dto/request/payments.pay.req.dto';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { PaymentsService } from 'src/3-domain/payments/payments.service';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { ReservationsService } from 'src/3-domain/reservations/reservations.service';
import { UsersService } from 'src/3-domain/users/users.service';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class PaymentsFacade {
  constructor(
    private readonly queueService: QueueService,
    private readonly reservationsService: ReservationsService,
    private readonly usersService: UsersService,
    private readonly concertsService: ConcertsService,
    private readonly paymentsService: PaymentsService,
    private readonly dataSource: DataSource,
  ) {}

  async payReservation(token: string, dto: PaymentsPayReqDto) {
    // 토큰 유효성 체크
    const queue = await this.queueService.getWorking({ token });

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

        // 예약상태를 결제로 변경
        await this.reservationsService.payReservation(
          entityManager,
          reservation,
        );

        // 예약 좌석의 상태를 결제로 변경
        await this.concertsService.paySeat(
          entityManager,
          reservation.concertMetaData.concertSeatId,
        );

        // 결제 내역 생성
        await this.paymentsService.create(
          entityManager,
          reservation.id,
          reservation.userId,
        );
      })
      .catch((error) => {
        console.error('', error);
        throw new ConflictException(error);
      });

    // 사용자 토큰 삭제
    await this.queueService.expire(queue);

    // 결제 정보 반환
    return payment;
  }
}
