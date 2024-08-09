import { UsersRepository } from 'src/4-infrastructure/users/users.repository';
import { PointModel, UsersModel } from './users.model';
import { UsersServiceGetProps } from './users.props';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PointHistoryTypeEnum } from 'src/4-infrastructure/users/entities/point-history.entity';

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

  async use(entityManager: EntityManager, userId: number, amount: number) {
    // 사용자 잔액 검증
    const point = await this.usersRepository.findWithPointById(
      entityManager,
      userId,
    );
    if (point == null) {
      throw new Error('포인트가 없음!');
    }

    if (point.amount < amount) {
      throw new BadRequestException('잔액이 부족합니다!');
    }

    // 포인트  차감
    point.amount -= amount;
    await this.usersRepository.updatePoint(entityManager, point);

    // 포인트 사용내역 생성
    await this.usersRepository.createPointHistory(
      entityManager,
      point,
      PointHistoryTypeEnum.USE,
    );
  }

  async getPoint(userId: number) {
    const point = await this.usersRepository.findPointByUserId(userId);
    if (!point) {
      throw new NotFoundException('포인트 정보를 찾을 수 없습니다.');
    }

    return point;
  }

  async chargePoint(
    entityManage: EntityManager,
    userId: number,
    amount: number,
  ): Promise<PointModel> {
    const point = await this.usersRepository.findWithPointById(
      entityManage,
      userId,
    );
    if (!point) {
      throw new NotFoundException('포인트 정보를 찾을 수 없습니다.');
    }

    point.amount += amount;

    return await this.usersRepository.updatePoint(entityManage, point);
  }

  // 포인트 환불 (기록을 사용하는 경우 refund로 처리하기 위해서 작성)
  async refund(entityManage: EntityManager, userId: number, amount: number) {
    const point = await this.usersRepository.findWithPointById(
      entityManage,
      userId,
    );
    if (!point) {
      throw new NotFoundException('포인트 정보를 찾을 수 없습니다.');
    }

    point.amount += amount;

    return await this.usersRepository.updatePoint(entityManage, point);
  }
}
