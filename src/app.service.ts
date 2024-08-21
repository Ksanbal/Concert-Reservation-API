import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProducerService } from './libs/message-broker/producer.service';
import { ConsumerService } from './libs/message-broker/consumer.service';
import { log } from 'winston';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // 테스트 메세지 발행
  async produce() {
    this.producerService.produce({
      topic: 'test-topic',
      messages: [
        {
          headers: {
            'test-header': 'test',
          },
          key: Math.floor(Math.random() * 100).toString(),
          value: 'Hello KafkaJS user!',
        },
      ],
    });
  }

  // 테스트 메세지 소비
  async onModuleInit() {
    await this.consumerService.consume(
      'nestjs-kafka',
      {
        topics: ['test-topic'],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          log('info', {
            message,
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }
}
