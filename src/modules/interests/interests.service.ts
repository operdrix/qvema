import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,
  ) { }

  async findAll(): Promise<Interest[]> {
    return this.interestsRepository.find();
  }

  async findOne(id: string): Promise<Interest> {
    const interest = await this.interestsRepository.findOne({ where: { id } });
    if (!interest) throw new NotFoundException('Intérêt non trouvé');
    return interest;
  }

  async create(name: string): Promise<Interest> {
    const interest = this.interestsRepository.create({ name });
    return this.interestsRepository.save(interest);
  }

  async update(id: string, name: string): Promise<Interest> {
    const interest = await this.findOne(id);
    interest.name = name;
    return this.interestsRepository.save(interest);
  }

  async remove(id: string): Promise<{ message: string }> {
    const interest = await this.findOne(id);
    await this.interestsRepository.remove(interest);
    return { message: 'Intérêt supprimé avec succès' };
  }
} 