import { Controller, Get, Headers, Param, ParseIntPipe } from '@nestjs/common';
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

@ApiTags('Concerts')
@Controller('concerts')
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
  async list(
    @Headers('Authorization') token: string,
  ): Promise<ConcertsResDto[]> {
    const result = await this.concertsFacade.getAvailableDates(token);
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
    @Headers('Authorization') token: string,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<ConcertsSeatsResDto[]> {
    const result = await this.concertsFacade.getSeats(token, {
      concertScheduleId: scheduleId,
    });

    return result.map(ConcertsSeatsResDto.fromModel);
  }
}
