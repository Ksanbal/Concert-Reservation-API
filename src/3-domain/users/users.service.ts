import { UsersRepository } from 'src/4-infrastructure/users/users.repository';
import { UsersModel } from './users.model';
import { UsersServiceGetProps } from './users.props';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async get(args: UsersServiceGetProps): Promise<UsersModel> {
    const user = await this.usersRepository.findById(args.id);

    if (!user) {
      throw new NotFoundException('유효하지 않은 사용자입니다.');
    }

    return user;
  }
}
