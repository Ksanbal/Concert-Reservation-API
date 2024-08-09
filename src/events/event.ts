import { PaymentsModel } from 'src/3-domain/payments/payments.model';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import { ReservationsModel } from 'src/3-domain/reservations/reservations.model';

// 결제 완료 이벤트
export class PaymentsPaiedEvent {
  static EVENT_NAME = 'payments.paied';

  constructor(
    public queue: QueueModel,
    public payment: PaymentsModel,
    public reservation: ReservationsModel,
  ) {}
}

// 결제 실패 이벤트
export class PaymentsPaiedErrorEvent {
  static EVENT_NAME = 'payments.paied-error';

  constructor(
    public queue: QueueModel,
    public payment: PaymentsModel,
    public reservation: ReservationsModel,
  ) {}
}
