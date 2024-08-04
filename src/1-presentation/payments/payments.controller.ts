import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
import { QueueGuard } from 'src/libs/guards/queue/queue.guard';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import { CurrentQueue } from 'src/libs/decorators/current-queue/current-queue.decorator';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(QueueGuard)
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
    @CurrentQueue() queue: QueueModel,
    @Body() body: PaymentsPayReqDto,
  ): Promise<PaymentsPayResDto> {
    const result = await this.paymentsFacade.payReservation(queue, body);
    return PaymentsPayResDto.fromModel(result);
  }
}
