import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/libs/message-broker/consumer.service';
import { log } from 'winston';
import { PaymentsPaiedEvenDto } from './dto/payments.event.dto';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from 'src/3-domain/payments/payments.service';

@Injectable()
export class PaymentsOutboxEvent implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // 결제 완료시 outbox 업데이트
    await this.consumerService.consume(
      `payments-${this.configService.get<string>('NODE_ENV')}-outbox`,
      {
        topics: [PaymentsPaiedEvenDto.EVENT_NAME],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          log(
            'info',
            `[${topic}] Payments Outbox - partition: ${partition}, key : ${message.key}`,
          );

          if (topic == PaymentsPaiedEvenDto.EVENT_NAME) {
            await this.updateOutbox(message);
          }
        },
      },
    );
  }

  private async updateOutbox(message) {
    const event: PaymentsPaiedEvenDto = JSON.parse(message.value.toString());
    await this.paymentsService.updateOutbox(event);
  }
}
