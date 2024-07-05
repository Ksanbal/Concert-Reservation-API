import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './presentation/queue/queue.module';
import { ConcertModule } from './presentation/concert/concert.module';
import { PointModule } from './presentation/point/point.module';

@Module({
  imports: [QueueModule, ConcertModule, PointModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
