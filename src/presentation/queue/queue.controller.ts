import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QueueResponseDto } from './queue.dto';

@Controller('queue')
export class QueueController {
  @Get(':userId')
  async getToken(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<QueueResponseDto> {
    return new QueueResponseDto({
      token: 'd07edb0f-3ac1-45a3-8972-7d263958b59d', // uuid
      status: 'wait', // wait, working
      remain: 1,
    });
  }
}
