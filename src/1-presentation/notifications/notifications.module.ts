import { Module } from '@nestjs/common';
import { NotificationsEvent } from 'src/events/notifications/notification.event';
import { ConsumerService } from 'src/libs/message-broker/consumer.service';

@Module({
  providers: [NotificationsEvent, ConsumerService],
})
export class NotificationsModule {}
