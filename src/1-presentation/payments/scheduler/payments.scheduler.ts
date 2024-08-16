import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsFacade } from 'src/2-application/payments/payments.facade';

@Injectable()
export class PaymentsScheduler {
  constructor(private readonly paymentsFacade: PaymentsFacade) {}

  /**
   * 발행되지 않은 결제 outbox를 발행 스케줄
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async publishOutbox(): Promise<void> {
    await this.paymentsFacade.publishOutbox();
  }
}
