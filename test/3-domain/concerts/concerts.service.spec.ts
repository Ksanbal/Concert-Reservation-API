import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { ConcertsRepository } from 'src/4-infrastructure/concerts/concerts.repository';
import { ConcertsMockRepository } from 'test/4-infrastructure/concerts/concerts.mock-repository';

describe('ConcertsService', () => {
  let service: ConcertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcertsService, ConcertsRepository],
    })
      .overrideProvider(ConcertsRepository)
      .useClass(ConcertsMockRepository)
      .compile();

    service = module.get<ConcertsService>(ConcertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('유효한 공연 날짜 목록 조회', () => {
    it('예매가능한 티켓들인지 테스트', async () => {
      // given
      // when
      const result = await service.getList();

      // then
      for (const concert of result) {
        for (const schedule of concert.schedules) {
          expect(schedule.ticketOpenAt.getTime()).toBeLessThanOrEqual(
            new Date().getTime(),
          );
          expect(schedule.ticketCloseAt.getTime()).toBeGreaterThan(
            new Date().getTime(),
          );
          expect(schedule.leftSeat).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('공연의 좌석 목록 조회', () => {
    it('존재하지 않는 스케줄을 조회한 경우', async () => {
      // given
      const id = 999;

      // when
      const result = service.getSeats(id);

      // then
      await expect(result).rejects.toThrow('유효하지않은 공연입니다.');
    });
  });
});
