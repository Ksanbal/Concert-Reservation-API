import { Body, Controller, Headers, Post } from '@nestjs/common';
import { PaymentsPayReqDto } from './dto/request/payments.pay.req.dto';
import { PaymentsPayResDto } from './dto/response/payments.pay.res.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaymentsFacade } from 'src/2-application/payments/payments.facade';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsFacade: PaymentsFacade) {}

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
    const result = await this.paymentsFacade.payReservation(token, body);
    return PaymentsPayResDto.fromModel(result);
  }
}
