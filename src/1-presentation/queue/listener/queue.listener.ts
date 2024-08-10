import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QueueFacade } from 'src/2-application/queue/queue.facade';
import { PaymentsPaiedErrorEvent, PaymentsPaiedEvent } from 'src/events/event';
import { log } from 'winston';

@Injectable()
export class QueueListener {
  constructor(private readonly queueFacade: QueueFacade) {}

  // 결제 완료 후 토큰 만료 처리
  @OnEvent(PaymentsPaiedEvent.EVENT_NAME)
  async handleExpireToken(event: PaymentsPaiedEvent) {
    log(
      'info',
      `[${PaymentsPaiedEvent.EVENT_NAME}] Queue - payment id : ${event.payment.id}`,
    );

    await this.queueFacade.expire(event);
  }

  // 결제 실패 이벤트 발생시 토큰 만료 롤백
  @OnEvent(PaymentsPaiedErrorEvent.EVENT_NAME)
  async handleChangeStatus(event: PaymentsPaiedErrorEvent) {
    log(
      'info',
      `[${PaymentsPaiedErrorEvent.EVENT_NAME}] Queue - payment id : ${event.payment.id}`,
    );
    await this.queueFacade.rollbackExpire(event);
  }
}
