import { Module } from '@nestjs/common';
import { NotificationsListener } from './listener/notifications.listener';

@Module({
  providers: [NotificationsListener],
})
export class NotificationsModule {}
