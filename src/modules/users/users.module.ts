import { Module } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';
import { InterestsModule } from '../interests/interests.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import UsersRepository from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Interest]),
    InterestsModule,
  ],
  providers: [UsersService,
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken()],
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(User).extend(UsersRepository)
      }
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
