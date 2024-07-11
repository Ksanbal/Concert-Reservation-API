import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/3-domain/users/users.service';
import { UsersRepository } from 'src/4-infrastructure/users/users.repository';
import { NotFoundException } from '@nestjs/common';
import { UsersMockRepository } from 'test/4-infrastructure/users/users.mock-repository';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository],
    })
      .overrideProvider(UsersRepository)
      .useValue(UsersMockRepository)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('사용자가 없는 경우', async () => {
      // given
      const id = 999;

      // when
      const result = service.get({ id });

      // then
      await expect(result).rejects.toThrow(
        new NotFoundException('유효하지 않은 사용자입니다.'),
      );
    });
  });
});
