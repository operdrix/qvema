import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User | null> {
    return await this.usersService.findOne(id);
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return await this.usersService.create(userData)
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User | null> {
    return await this.usersService.update(id, userData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
