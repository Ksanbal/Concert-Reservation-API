import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueFacade } from 'src/2-application/queue/queue.facade';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { UsersService } from 'src/3-domain/users/users.service';
import { QueueEntity } from 'src/4-infrastructure/queue/entities/queue.entity';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { UserEntity } from 'src/4-infrastructure/users/entities/user.entity';
import { UsersRepository } from 'src/4-infrastructure/users/users.repository';
import { DatabaseModule } from 'src/libs/database/database.module';

describe('QueueFacade', () => {
  let facade: QueueFacade;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          cache: true,
          isGlobal: true,
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([QueueEntity, UserEntity]),
      ],
      providers: [
        QueueFacade,
        UsersService,
        QueueService,
        UsersRepository,
        QueueRepository,
      ],
    }).compile();

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
      const result = await facade.create({ userId });

      // then
      expect(result).toBeInstanceOf(QueueModel);
    });
  });

  describe('대기열 토큰 유효성 체크', () => {
    it('성공', async () => {
      // given
      const userId = 1;
      const queue = await facade.create({ userId });

      // when
      const result = await facade.get({ token: queue.token });

      // then
      expect(result).toBeInstanceOf(QueueModel);
    });
  });

  describe('대기열 토큰 유효기간 연장', () => {
    it('성공', async () => {
      // given
      const userId = 1;
      const queue = await facade.create({ userId });

      // when
      const result = await facade.extend({ token: queue.token });

      // then
      expect(result).toBeInstanceOf(QueueModel);
    });
  });

  describe('대기열 처리 스케줄', () => {
    it('성공', async () => {
      // given
      // when
      // then
    });
  });
});
