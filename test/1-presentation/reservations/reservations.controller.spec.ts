import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsResDto } from 'src/1-presentation/reservations/dto/response/reservations.res.dto';
import { ReservationsController } from 'src/1-presentation/reservations/reservations.controller';

describe('ReservationsController', () => {
  let controller: ReservationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('공연 예약', () => {
    it('성공', async () => {
      // given
      const token = 'd07edb0f-3ac1-45a3-8972-7d263958b59d';
      const body = {
        scheduleId: 1,
        seatId: 1,
      };

      // when
      const result = await controller.create(token, body);

      // then
      expect(result).toBeInstanceOf(ReservationsResDto);
    });
  });
});
