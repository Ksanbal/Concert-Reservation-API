import { UserEntity } from 'src/4-infrastructure/users/entities/user.entity';

export class UsersModel {
  id: number;
  name: string;

  constructor(props: UsersModel) {
    this.id = props.id;
    this.name = props.name;
  }

  static fromEntity(entity: UserEntity | null): UsersModel {
    if (entity == null) {
      return null;
    }

    return new UsersModel({
      id: entity.id,
      name: entity.name,
    });
  }
}
