import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from '../../modules/interests/entities/interest.entity';
import { Investment } from '../../modules/investments/entities/investment.entity';
import { Project } from '../../modules/projects/entities/project.entity';
import { User } from '../../modules/users/entities/user.entity';
import { LoadFixturesCommand } from './fixtures.command';
import { FixturesService } from './fixtures.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Interest, Project, Investment]),
  ],
  providers: [FixturesService, LoadFixturesCommand],
  exports: [FixturesService, LoadFixturesCommand],
})
export class FixturesModule { } 