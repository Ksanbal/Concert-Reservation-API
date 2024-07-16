import { Test, TestingModule } from '@nestjs/testing';
import { UsersPointResDto } from 'src/1-presentation/users/dto/response/users.point.res.dto';
import { UsersController } from 'src/1-presentation/users/users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('포인트 조회', () => {
    it('성공', async () => {
      // given
      const userId = 1;

      // when
      const result = await controller.getPoint(userId);

      // then
      expect(result).toBeInstanceOf(UsersPointResDto);
    });
  });

  describe('포인트 충전', () => {
    it('성공', async () => {
      // given
      const userId = 1;
      const amount = 1000;

      // when
      const result = await controller.chargePoint(userId, { amount });

      // then
      expect(result).toBeInstanceOf(UsersPointResDto);
    });
  });
});
