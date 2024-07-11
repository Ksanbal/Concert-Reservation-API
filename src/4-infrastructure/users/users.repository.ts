import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/3-domain/users/users.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<UsersModel> {
    return UsersModel.fromEntity(
      await this.userRepository.findOne({ where: { id } }),
    );
  }
}
