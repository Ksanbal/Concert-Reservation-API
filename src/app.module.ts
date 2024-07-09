import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './presentation/queue/queue.module';
import { UsersModule } from './presentation/users/users.module';
import { PaymentsModule } from './presentation/payments/payments.module';
import { ConcertsModule } from './presentation/concerts/concerts.module';
import { ReservationsModule } from './presentation/reservations/reservations.module';

@Module({
  imports: [
    QueueModule,
    UsersModule,
    PaymentsModule,
    ConcertsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
