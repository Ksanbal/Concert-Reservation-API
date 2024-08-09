import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentsFacade } from 'src/2-application/payments/payments.facade';
import { PaymentsPaiedErrorEvent } from 'src/events/event';
import { log } from 'winston';

@Injectable()
export class PaymentsListener {
  constructor(private readonly paymentsFacade: PaymentsFacade) {}

  // 결제 실패 이벤트 발생시 결제 정보 롤백
  @OnEvent(PaymentsPaiedErrorEvent.EVENT_NAME)
  async handleChangeStatus(event: PaymentsPaiedErrorEvent) {
    log(
      'info',
      `[${PaymentsPaiedErrorEvent.EVENT_NAME}] Payments - payment id : ${event.payment.id}`,
    );
    await this.paymentsFacade.rollbackPayment(event);
  }
}
