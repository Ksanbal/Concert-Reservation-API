import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ReservationsCreateReqDto } from './dto/request/reservations.reserve.req.dto';
import { ReservationsResDto } from './dto/response/reservations.res.dto';
import { ReservationStatusEnum } from './dto/enum/reservations.status.enum';

@Controller('reservations')
export class ReservationsController {
  @Post()
  create(
    @Headers('authorization') token: string,
    @Body() body: ReservationsCreateReqDto,
  ) {
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
