import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from 'src/1-presentation/concerts/concerts.controller';
import { ConcertsResDto } from 'src/1-presentation/concerts/dto/response/concerts.res.dto';
import { ConcertsSeatsResDto } from 'src/1-presentation/concerts/dto/response/concerts.seats.res.dto';

describe('ConcertsController', () => {
  let controller: ConcertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('예약 가능한 공연 날짜 조회', () => {
    it('성공', async () => {
      // given
      const token = 'd07edb0f-3ac1-45a3-8972-7d263958b59d';

      // when
      const result = await controller.list(token);

      // then
      expect(result).toBeInstanceOf(Array<ConcertsResDto>);
    });
  });

  describe('공연 좌석 조회', () => {
    it('성공', async () => {
      // given
      const token = 'd07edb0f-3ac1-45a3-8972-7d263958b59d';
      const scheduleId = 1;

      // when
      const result = await controller.seats(token, scheduleId);

      // then
      expect(result).toBeInstanceOf(Array<ConcertsSeatsResDto>);
    });
  });
});
