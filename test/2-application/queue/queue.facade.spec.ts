import { Test, TestingModule } from '@nestjs/testing';
import { QueueFacade } from 'src/2-application/queue/queue.facade';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { UsersService } from 'src/3-domain/users/users.service';
import { QueueStatusEnum } from 'src/4-infrastructure/queue/entities/queue.entity';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { UsersRepository } from 'src/4-infrastructure/users/users.repository';
import { QueueMockRepository } from 'test/4-infrastructure/queue/queue.mock-repository';
import { UsersMockRepository } from 'test/4-infrastructure/users/users.mock-repository';

describe('QueueFacade', () => {
  let facade: QueueFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueFacade,
        UsersService,
        QueueService,
        UsersRepository,
        QueueRepository,
      ],
    })
      .overrideProvider(UsersRepository)
      .useValue(UsersMockRepository)
      .overrideProvider(QueueRepository)
      .useValue(QueueMockRepository)
      .compile();

    facade = module.get<QueueFacade>(QueueFacade);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('대기열 토큰 발급', () => {
    it('성공', async () => {
      // given
      const userId = 1;

      // when
      const result = facade.create({ userId });

      // then
      await expect(result).resolves.toEqual({
        id: expect.any(Number),
        expiredAt: expect.any(Date),
        token: expect.any(String),
        userId,
        status: QueueStatusEnum.WAIT,
        remain: expect.any(Number),
      });
    });
  });

  describe('대기열 토큰 유효성 체크', () => {
    it('성공', async () => {
      // given
      const userId = 1;
      const newQueue = await facade.create({ userId });

      // when
      const result = facade.get({ token: newQueue.token });

      // then
      await expect(result).resolves.toEqual({
        id: newQueue.id,
        expiredAt: expect.any(Date),
        token: newQueue.token,
        userId: newQueue.userId,
        status: newQueue.status,
        remain: expect.any(Number),
      });
    });
  });

  describe('대기열 토큰 유효기간 연장', () => {
    it('성공', async () => {
      // given
      const userId = 2;
      const newQueue = await facade.create({ userId });

      // when
      const result = await facade.extend({ token: newQueue.token });

      // then
      expect(result.expiredAt.getTime()).toBeGreaterThanOrEqual(
        newQueue.expiredAt.getTime(),
      );
    });
  });

  describe('대기열 처리 스케줄', () => {
    it('성공', async () => {
      // given

      // when
      facade.processQueue();

      // then
    });
  });
});
