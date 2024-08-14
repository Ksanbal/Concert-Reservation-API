import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Partitioners, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(private readonly configService: ConfigService) {
    const brokers = this.configService.get<string>('KAFKA_BROKERS').split(',');
    this.kafka = new Kafka({
      brokers,
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
