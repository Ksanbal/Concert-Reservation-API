import { Body, Controller, Headers, Post } from '@nestjs/common';
import { PaymentsPayReqDto } from './dto/request/payments.pay.req.dto';
import { PaymentsPayResDto } from './dto/response/payments.pay.res.dto';
import { PaymentsReservationStatusEnum } from './dto/enum/payments.reservation-status.enum';

@Controller('payments')
export class PaymentsController {
  @Post()
  async pay(
    @Headers('authorization') token: string,
    @Body() body: PaymentsPayReqDto,
  ) {
    return new PaymentsPayResDto({
      id: 1,
      createdAt: new Date('2023-04-12T14:30:00+09:00'),
      reservation: {
        id: body.reservationId,
        createdAt: new Date('2023-04-12T14:30:00+09:00'),
        updatedAt: new Date('2023-04-12T14:30:00+09:00'),
        expiredAt: new Date('2023-04-12T14:30:00+09:00'),
        status: PaymentsReservationStatusEnum.PAIED,
        concertMetaData: {
          concertName: '카리나의 왁자지껄',
          concertScheduleDate: new Date('2023-04-12T14:30:00+09:00'),
          concertSeatNumber: 1,
          concertSeatPrice: 50000,
        },
      },
    });
  }
}
