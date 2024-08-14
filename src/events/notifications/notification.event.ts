import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/libs/message-broker/consumer.service';
import { log } from 'winston';
import { PaymentsPaiedEvenDto } from '../payments/dto/payments.event.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsEvent implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // 결제 완료 후 사용자에게 알림 전송(더미 로직)
    await this.consumerService.consume(
      `notifications-${this.configService.get<string>('NODE_ENV')}-payments`,
      {
        topics: [PaymentsPaiedEvenDto.EVENT_NAME],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          log(
            'info',
            `[${topic}] Notifications - partition: ${partition}, key : ${message.key}`,
          );

          // 0~1초 대기
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 1000),
          );
        },
      },
    );
  }
}
