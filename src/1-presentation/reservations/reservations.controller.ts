import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReservationsCreateReqDto } from './dto/request/reservations.reserve.req.dto';
import { ReservationsResDto } from './dto/response/reservations.res.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReservationsFacade } from 'src/2-application/reservations/reservations.facade';
import { QueueGuard } from 'src/libs/guards/queue/queue.guard';
import { CurrentQueue } from 'src/libs/decorators/current-queue/current-queue.decorator';
import { QueueModel } from 'src/3-domain/queue/queue.model';

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(QueueGuard)
export class ReservationsController {
  constructor(private readonly reservationsFacade: ReservationsFacade) {}

  @ApiOperation({
    summary: '좌석 예약',
  })
  @ApiCreatedResponse({ type: ReservationsResDto })
  @ApiBadRequestResponse({
    example: {
      message: '이미 선택된 좌석입니다.',
    },
  })
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
  @Post()
  async create(
    @CurrentQueue() queue: QueueModel,
    @Body() body: ReservationsCreateReqDto,
  ): Promise<ReservationsResDto> {
    const result = await this.reservationsFacade.create(queue, body);
    return ReservationsResDto.fromModel(result);
  }
}
