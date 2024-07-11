import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './1-presentation/queue/queue.module';
import { UsersModule } from './1-presentation/users/users.module';
import { PaymentsModule } from './1-presentation/payments/payments.module';
import { ConcertsModule } from './1-presentation/concerts/concerts.module';
import { ReservationsModule } from './1-presentation/reservations/reservations.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './libs/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    DatabaseModule,
    QueueModule,
    UsersModule,
    PaymentsModule,
    ConcertsModule,
    ReservationsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
