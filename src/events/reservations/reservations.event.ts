import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/libs/message-broker/consumer.service';
import { log } from 'winston';
import { PaymentsPaiedEvenDto } from '../payments/dto/payments.event.dto';
import { ReservationsFacade } from 'src/2-application/reservations/reservations.facade';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReservationsEvent implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly reservationsFacade: ReservationsFacade,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // 결제 완료 후 토큰 만료 처리
    await this.consumerService.consume(
      `reservations-${this.configService.get<string>('NODE_ENV')}-payments`,
      {
        topics: [PaymentsPaiedEvenDto.EVENT_NAME],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          log(
            'info',
            `[${topic}] Reservations - partition: ${partition}, key : ${message.key}`,
          );

          const event: PaymentsPaiedEvenDto = JSON.parse(
            message.value.toString(),
          );
          await this.reservationsFacade.payReservation(event);
        },
      },
    );
  }
}
