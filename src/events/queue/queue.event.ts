import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/libs/message-broker/consumer.service';
import { log } from 'winston';
import { QueueFacade } from 'src/2-application/queue/queue.facade';
import {
  PaymentsPaiedErrorEventDto,
  PaymentsPaiedEvenDto,
} from '../payments/dto/payments.event.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueEvent implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly queueFacade: QueueFacade,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      `queue-${this.configService.get<string>('NODE_ENV')}-payments`,
      {
        topics: [
          PaymentsPaiedEvenDto.EVENT_NAME,
          PaymentsPaiedErrorEventDto.EVENT_NAME,
        ],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          log(
            'info',
            `[${topic}] Queue - partition: ${partition}, key : ${message.key}`,
          );

          if (topic == PaymentsPaiedEvenDto.EVENT_NAME) {
            await this.handleExpireToken(message);
          }

          if (topic == PaymentsPaiedErrorEventDto.EVENT_NAME) {
            await this.handleChangeStatus(message);
          }
        },
      },
    );
  }

  // 결제 완료 후 토큰 만료 처리
  private async handleExpireToken(message) {
    const event: PaymentsPaiedEvenDto = JSON.parse(message.value.toString());
    await this.queueFacade.expire(event);
  }

  // 결제 실패 이벤트 발생시 토큰 만료 롤백
  private async handleChangeStatus(message) {
    const event: PaymentsPaiedErrorEventDto = JSON.parse(
      message.value.toString(),
    );
    await this.queueFacade.rollbackExpire(event);
  }
}
