import { PointEntity } from 'src/4-infrastructure/users/entities/point.entity';
import { UserEntity } from 'src/4-infrastructure/users/entities/user.entity';

export class UsersModel {
  id: number;
  name: string;

  constructor(props: UsersModel) {
    this.id = props.id;
    this.name = props.name;
  }

  static fromEntity(entity: UserEntity | null): UsersModel | null {
    if (entity == null) {
      return null;
    }

    return new UsersModel({
      id: entity.id,
      name: entity.name,
    });
  }
}

export class PointModel {
  id: number;
  userId: number;
  amount: number;

  constructor(pointEntity: PointEntity) {
    this.id = pointEntity.id;
    this.userId = pointEntity.userId;
    this.amount = pointEntity.amount;
  }
}

// export class UsersModelWithPoint extends UsersModel {
//   point: PointModel;

//   constructor(userEntity: UserEntity | null, pointEntity: PointEntity | null) {
//     super(userEntity);
//     this.point = new PointModel(pointEntity);
//   }
// }
