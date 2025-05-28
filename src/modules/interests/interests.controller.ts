import { Controller, Get } from '@nestjs/common';
import { Interest } from './entities/interest.entity';
import { InterestsService } from './interests.service';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) { }

  @Get()
  async findAll(): Promise<Interest[]> {
    return this.interestsService.findAll();
  }
} 