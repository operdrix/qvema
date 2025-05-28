import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { InterestsController } from './interests.controller';
import { InterestsService } from './interests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  providers: [InterestsService],
  controllers: [InterestsController],
  exports: [InterestsService],
})
export class InterestsModule { } 