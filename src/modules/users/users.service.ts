import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import type { UsersRepositoryType } from './users.repository';

@Injectable()
export class UsersService {

  constructor(
    @Inject(getRepositoryToken(User))
    private readonly usersRepository: UsersRepositoryType,
    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,
  ) { }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await this.usersRepository.update(id, userData);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.delete(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'email ${email} non trouvé`);
    }
    return user;
  }

  async setUserInterests(userId: string, interestIds: string[]): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    const interests = await this.interestsRepository.findByIds(interestIds);
    user.interests = interests;
    return await this.usersRepository.save(user);
  }
}
