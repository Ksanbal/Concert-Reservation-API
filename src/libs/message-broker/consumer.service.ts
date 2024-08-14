import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {
    const brokers = this.configService.get<string>('KAFKA_BROKERS').split(',');
    this.kafka = new Kafka({
      brokers,
    });
  }

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({
      groupId: this.configService.get<string>('KAFKA_CONSUMER_GROUP_ID'),
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
