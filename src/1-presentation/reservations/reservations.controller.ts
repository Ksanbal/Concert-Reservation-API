import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ReservationsCreateReqDto } from './dto/request/reservations.reserve.req.dto';
import { ReservationsResDto } from './dto/response/reservations.res.dto';
import { ReservationStatusEnum } from './dto/enum/reservations.status.enum';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
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
    @Headers('authorization') token: string,
    @Body() body: ReservationsCreateReqDto,
  ): Promise<ReservationsResDto> {
    return new ReservationsResDto({
      id: 1,
      createdAt: new Date('2023-04-12T14:30:00+09:00'),
      updatedAt: new Date('2023-04-12T14:30:00+09:00'),
      expiredAt: new Date('2023-04-12T14:30:00+09:00'),
      status: ReservationStatusEnum.PAIED,
      concertMetaData: {
        concertName: '카리나의 왁자지껄',
        concertScheduleDate: new Date('2023-04-12T14:30:00+09:00'),
        concertSeatNumber: 1,
        concertSeatPrice: 50000,
      },
    });
  }
}
