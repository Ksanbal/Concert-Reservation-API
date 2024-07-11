import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { UsersRepository } from 'src/4-infrastructure/users/users.repository';
import { UsersMockRepository } from 'test/4-infrastructure/users/users.mock-repository';
import { QueueMockRepository } from 'test/4-infrastructure/queue/queue.mock-repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { QueueStatusEnum } from 'src/4-infrastructure/queue/entities/queue.entity';
import { QueueModel } from 'src/3-domain/queue/queue.model';

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueService, UsersRepository, QueueRepository],
    })
      .overrideProvider(UsersRepository)
      .useValue(UsersMockRepository)
      .overrideProvider(QueueRepository)
      .useClass(QueueMockRepository)
      .compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('토큰 발급', () => {
    it('만료된 토큰인 경우', async () => {
      // given
      const userId = 1;

      // when
      const result = service.create({ userId });

      // then
      await expect(result).resolves.toMatchObject({
        userId,
        status: QueueStatusEnum.WAIT,
      });
    });

    it('유효기간이 남은 토큰이 있는 경우', async () => {
      // given
      const userId = 2;

      // when
      const result = service.create({ userId });

      // then
      await expect(result).resolves.toMatchObject({
        userId,
        status: QueueStatusEnum.WORKING,
      });
    });
  });

  describe('토큰 유효성 체크', () => {
    it('존재하지 않는 토큰인 경우', async () => {
      // given
      const token = 'unknown-token';

      // when
      const result = service.get({ token });

      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('이미 만료된 토큰인 경우', async () => {
      // given
      const token = 'expired-token';

      // when
      const result = service.get({ token });

      // then
      await expect(result).rejects.toThrow(ForbiddenException);
    });
  });

  describe('토큰 유효기간 연장', () => {
    it('성공', async () => {
      // given
      const queue = new QueueModel({
        id: 3,
        expiredAt: new Date('2100-08-01T00:00:00Z'),
        token: 'waiting-token',
        userId: 3,
        status: QueueStatusEnum.WAIT,
        remain: 1,
      });

      // when
      const result = await service.extend(queue);

      // then
      await expect(result.expiredAt.getTime()).toBeGreaterThanOrEqual(
        queue.expiredAt.getTime(),
      );
    });
  });

  describe('대기중인 대기열 토큰 상태 변경', () => {
    it('상태가 wait인 토큰이 working으로 바뀌는지 테스트', async () => {
      // given
      const token = 'waiting-token';

      // when
      await service.processQueue();
      const result = service.get({ token });

      // then
      await expect(result).resolves.toMatchObject({
        status: QueueStatusEnum.WORKING,
      });
    });
  });

  describe('만료된 대기열 토큰 만료처리', () => {
    it('성공', async () => {
      // given
      const token = 'remain-token';

      // when
      await service.processExpiredQueue();

      // then
    });
  });

  describe('상태가 활성화된 토큰 조회', () => {
    it('존재하지 않는 토큰인 경우', async () => {
      // given
      const token = 'unkown-token';

      // when
      const result = service.getWorking({ token });

      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('만료된 토큰인 경우', async () => {
      // given
      const token = 'expired-token';

      // when
      const result = service.getWorking({ token });

      // then
      await expect(result).rejects.toThrow(ForbiddenException);
    });

    it('대기중인 토큰인 경우', async () => {
      // given
      const token = 'waiting-token';

      // when
      const result = service.getWorking({ token });

      // then
      await expect(result).rejects.toThrow(ForbiddenException);
    });
  });
});
