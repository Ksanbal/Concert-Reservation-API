import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/libs/message-broker/consumer.service';
import { log } from 'winston';
import { PaymentsPaiedErrorEventDto } from './dto/payments.event.dto';
import { PaymentsFacade } from 'src/2-application/payments/payments.facade';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsEvent implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly paymentsFacade: PaymentsFacade,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // 결제 실패 이벤트 발생시 토큰 만료 롤백
    await this.consumerService.consume(
      `payments-${this.configService.get<string>('NODE_ENV')}-payments`,
      {
        topics: [PaymentsPaiedErrorEventDto.EVENT_NAME],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          log(
            'info',
            `[${topic}] Payments - partition: ${partition}, key : ${message.key}`,
          );

          const event: PaymentsPaiedErrorEventDto = JSON.parse(
            message.value.toString(),
          );
          await this.paymentsFacade.rollbackPayment(event);
        },
      },
    );
  }
}
