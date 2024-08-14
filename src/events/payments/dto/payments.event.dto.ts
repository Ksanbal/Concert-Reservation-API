import { PaymentsModel } from 'src/3-domain/payments/payments.model';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import { ReservationsModel } from 'src/3-domain/reservations/reservations.model';

// 결제 완료 이벤트
export class PaymentsPaiedEvenDto {
  static EVENT_NAME = `${process.env.NODE_ENV == 'production' ? 'prod' : 'dev'}.payments.pay-reservation.v1`;

  constructor(
    public queue: QueueModel,
    public payment: PaymentsModel,
    public reservation: ReservationsModel,
  ) {}
}

// 결제 실패 이벤트
export class PaymentsPaiedErrorEventDto {
  static EVENT_NAME = `${process.env.NODE_ENV == 'production' ? 'prod' : 'dev'}.payments.pay-reservation-error.v1`;

  constructor(
    public queue: QueueModel,
    public payment: PaymentsModel,
    public reservation: ReservationsModel,
  ) {}
}
