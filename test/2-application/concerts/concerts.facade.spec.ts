import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsFacade } from 'src/2-application/concerts/concerts.facade';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { ConcertsRepository } from 'src/4-infrastructure/concerts/concerts.repository';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { ConcertsMockRepository } from 'test/4-infrastructure/concerts/concerts.mock-repository';
import { QueueMockRepository } from 'test/4-infrastructure/queue/queue.mock-repository';

describe('ConcertsFacade', () => {
  let facade: ConcertsFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsFacade,
        ConcertsService,
        ConcertsRepository,
        QueueService,
        QueueRepository,
      ],
    })
      .overrideProvider(ConcertsRepository)
      .useClass(ConcertsMockRepository)
      .overrideProvider(QueueRepository)
      .useClass(QueueMockRepository)
      .compile();

    facade = module.get<ConcertsFacade>(ConcertsFacade);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('예약 가능한 공연 날짜 조회', () => {
    it('유효하지 않은 토큰을 사용한 경우', async () => {
      // given
      const token = 'expired-token';

      // when
      const result = facade.getAvailableDates(token);

      // then
      await expect(result).rejects.toThrow(ForbiddenException);
    });
  });

  describe('공연 좌석 조회', () => {
    it('유효하지 않은 토큰을 사용한 경우', async () => {
      // given
      const token = 'expired-token';
      const concertScheduleId = 1;

      // when
      const result = facade.getSeats(token, { concertScheduleId });

      // then
      await expect(result).rejects.toThrow(ForbiddenException);
    });
  });
});
