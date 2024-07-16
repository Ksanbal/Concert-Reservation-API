import { Body, Controller, Headers, Post } from '@nestjs/common';
import { PaymentsPayReqDto } from './dto/request/payments.pay.req.dto';
import { PaymentsPayResDto } from './dto/response/payments.pay.res.dto';
import { PaymentsReservationStatusEnum } from './dto/enum/payments.reservation-status.enum';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  @ApiOperation({
    summary: '공연 결제',
  })
  @ApiCreatedResponse({ type: PaymentsPayResDto })
  @ApiBadRequestResponse({
    example: {
      message: '포인트가 부족합니다.',
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
  async pay(
    @Headers('authorization') token: string,
    @Body() body: PaymentsPayReqDto,
  ): Promise<PaymentsPayResDto> {
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
