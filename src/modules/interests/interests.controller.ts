import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/enums/role.enum';
import { Interest } from './entities/interest.entity';
import { InterestsService } from './interests.service';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) { }

  @Get()
  async findAll(): Promise<Interest[]> {
    return this.interestsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Interest> {
    return this.interestsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body('name') name: string): Promise<Interest> {
    return this.interestsService.create(name);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body('name') name: string): Promise<Interest> {
    return this.interestsService.update(id, name);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.interestsService.remove(id);
  }
} 