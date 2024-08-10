import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentsPaiedEvent } from 'src/events/event';
import { log } from 'winston';

@Injectable()
export class NotificationsListener {
  // 결제 완료 후 사용자에게 알림 전송(더미 로직)
  @OnEvent(PaymentsPaiedEvent.EVENT_NAME)
  async handleSendNotification(event: PaymentsPaiedEvent) {
    log(
      'info',
      `[${PaymentsPaiedEvent.EVENT_NAME}] Notifications - payment id : ${event.payment.id}`,
    );

    // 0~1초 대기
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
  }
}
