import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsReservationStatusEnum } from 'src/presentation/payments/dto/enum/payments.reservation-status.enum';
import { PaymentsPayResDto } from 'src/presentation/payments/dto/response/payments.pay.res.dto';
import { PaymentsController } from 'src/presentation/payments/payments.controller';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('공연 결제', () => {
    it('성공', async () => {
      // given
      const token = 'd07edb0f-3ac1-45a3-8972-7d263958b59d';
      const reservationId = 1;

      // when
      const result = await controller.pay(token, {
        reservationId,
      });

      // then
      expect(result).toBeInstanceOf(PaymentsPayResDto);
      expect(result.reservation.id).toEqual(reservationId);
      expect(result.reservation.status).toEqual(
        PaymentsReservationStatusEnum.PAIED,
      );
    });
  });
});
