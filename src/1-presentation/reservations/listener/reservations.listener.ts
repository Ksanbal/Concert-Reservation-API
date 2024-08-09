import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReservationsFacade } from 'src/2-application/reservations/reservations.facade';
import { PaymentsPaiedEvent } from 'src/events/event';
import { log } from 'winston';

@Injectable()
export class ReservationsListener {
  constructor(private readonly reservationsFacade: ReservationsFacade) {}

  // 결제 완료 후 예약 상태 변경
  @OnEvent(PaymentsPaiedEvent.EVENT_NAME)
  async handleChangeStatus(event: PaymentsPaiedEvent) {
    log(
      'info',
      `[${PaymentsPaiedEvent.EVENT_NAME}] Reservations - payment id : ${event.payment.id}`,
    );
    await this.reservationsFacade.payReservation(event);
  }
}
