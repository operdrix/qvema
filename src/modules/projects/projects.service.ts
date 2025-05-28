import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async create(createProjectDto: CreateProjectDto, owner: User): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      owner,
    });
    return await this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectsRepository.find();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: Partial<CreateProjectDto>, owner: User): Promise<Project> {
    const project = await this.findOne(id);

    if (project.owner.id !== owner.id) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    Object.assign(project, updateProjectDto);
    return await this.projectsRepository.save(project);
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const project = await this.findOne(id);
    // Seul le créateur (entrepreneur) ou un admin peut supprimer
    if (project.owner.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Vous n'avez pas le droit de supprimer ce projet");
    }
    await this.projectsRepository.remove(project);
    return { message: 'Projet supprimé avec succès' };
  }

  async findByOwner(ownerId: string): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { owner: { id: ownerId } },
    });
  }

  async getRecommended(userId: string): Promise<Project[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['interests'] });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    if (!user.interests || user.interests.length === 0) return [];
    const interestIds = user.interests.map(i => i.id);
    return this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.interests', 'interest')
      .where('interest.id IN (:...interestIds)', { interestIds })
      .getMany();
  }
} 