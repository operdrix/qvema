import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { SelfOrAdmin } from '../auth/decorators/self-or-admin.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SelfOrAdminGuard } from '../auth/guards/self-or-admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './enums/role.enum';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    return await this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Get('email/:email')
  @Roles(UserRole.ADMIN)
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.findOneByEmail(email);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(SelfOrAdminGuard)
  @SelfOrAdmin()
  async update(@Param('id') id: string, @Body() userData: Partial<CreateUserDto>): Promise<User> {
    return await this.usersService.update(id, userData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
