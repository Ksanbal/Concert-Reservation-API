import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';

@Module({
  controllers: [ConcertsController],
})
export class ConcertsModule {}
