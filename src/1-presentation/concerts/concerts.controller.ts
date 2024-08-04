import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ConcertsResDto } from './dto/response/concerts.res.dto';
import { ConcertsSeatsResDto } from './dto/response/concerts.seats.res.dto';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConcertsFacade } from 'src/2-application/concerts/concerts.facade';
import { QueueGuard } from 'src/libs/guards/queue/queue.guard';

@ApiTags('Concerts')
@Controller('concerts')
@UseGuards(QueueGuard)
export class ConcertsController {
  constructor(private readonly concertsFacade: ConcertsFacade) {}

  @ApiOperation({
    summary: '예약 가능한 공연 날짜 조회',
  })
  @ApiOkResponse({ type: ConcertsResDto, isArray: true })
  @ApiUnauthorizedResponse({
    example: {
      message: '유효하지 않은 토큰입니다.',
    },
  })
  @ApiForbiddenResponse({
    example: {
      message: '유효하지 않은 토큰입니다.',
    },
  })
  @Get()
  async list(): Promise<ConcertsResDto[]> {
    const result = await this.concertsFacade.getAvailableDates();
    return result.map(ConcertsResDto.fromModel);
  }

  @ApiOperation({
    summary: '공연 좌석 조회',
  })
  @ApiOkResponse({ type: ConcertsSeatsResDto, isArray: true })
  @ApiUnauthorizedResponse({
    example: {
      message: '유효하지 않은 토큰입니다.',
    },
  })
  @ApiForbiddenResponse({
    example: {
      message: '유효하지 않은 토큰입니다.',
    },
  })
  @Get('schedules/:scheduleId/seats')
  async seats(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<ConcertsSeatsResDto[]> {
    const result = await this.concertsFacade.getSeats({
      concertScheduleId: scheduleId,
    });

    return result.map(ConcertsSeatsResDto.fromModel);
  }
}
