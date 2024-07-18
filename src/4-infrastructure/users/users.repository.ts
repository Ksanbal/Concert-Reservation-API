import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { PointModel, UsersModel } from 'src/3-domain/users/users.model';
import { Injectable } from '@nestjs/common';
import { PointEntity } from './entities/point.entity';
import {
  PointHistoryEntity,
  PointHistoryTypeEnum,
} from './entities/point-history.entity';

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

  async findWithPointById(
    entityManager: EntityManager,
    userId: number,
  ): Promise<PointModel | null> {
    const entity = await entityManager.findOne(PointEntity, {
      where: {
        userId,
      },
    });

    if (entity == null) {
      return null;
    }

    return new PointModel(entity);
  }

  async updatePoint(entityManager: EntityManager, point: PointModel) {
    await entityManager.update(PointEntity, point.id, point);
  }

  async createPointHistory(
    entityManager: EntityManager,
    point: PointModel,
    type: PointHistoryTypeEnum,
  ) {
    await entityManager.insert(PointHistoryEntity, {
      userId: point.userId,
      amount: point.amount,
      type,
    });
  }
}
