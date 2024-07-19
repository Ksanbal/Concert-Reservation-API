import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/4-infrastructure/users/entities/user.entity';
import { PointEntity } from 'src/4-infrastructure/users/entities/point.entity';
import { UsersFacade } from 'src/2-application/users/users.facade';
import { UsersService } from 'src/3-domain/users/users.service';
import { UsersRepository } from 'src/4-infrastructure/users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PointEntity])],
  controllers: [UsersController],
  providers: [UsersFacade, UsersService, UsersRepository],
})
export class UsersModule {}
