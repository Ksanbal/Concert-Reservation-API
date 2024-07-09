import { Test, TestingModule } from '@nestjs/testing';
import { QueueTokenResDto } from 'src/presentation/queue/dto/response/queue.token.res.dto';
import { QueueController } from 'src/presentation/queue/queue.controller';

describe('QueueController', () => {
  let controller: QueueController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QueueController],
    }).compile();

    controller = app.get<QueueController>(QueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // 대기열 토큰 발급
  describe('대기열 토큰 발급', () => {
    it('성공', async () => {
      // given
      const body = {
        userId: 1,
      };

      // when
      const result = await controller.create(body);

      // then
      expect(result).toBeInstanceOf(QueueTokenResDto);
    });
  });

  // 대기열 토큰 유효기간 연장
  describe('대기열 토큰 유효기간 연장', () => {
    it('성공', async () => {
      // given
      const token = 'd07edb0f-3ac1-45a3-8972-7d263958b59d';

      // when
      const result = await controller.extend(token);

      // then
      expect(result).toBeInstanceOf(QueueTokenResDto);
      expect(result.token).toEqual(token);
    });
  });

  // 대기열 토큰 유효성 체크
  describe('대기열 토큰 유효성 체크', () => {
    it('성공', async () => {
      // given
      const token = 'd07edb0f-3ac1-45a3-8972-7d263958b59d';

      // when
      const result = await controller.validateToken(token);

      // then
      expect(result).toBeInstanceOf(QueueTokenResDto);
      expect(result.token).toEqual(token);
    });
  });
});
