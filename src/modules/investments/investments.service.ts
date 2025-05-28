import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/role.enum';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { Investment } from './entities/investment.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentsRepository: Repository<Investment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) { }

  async findAll(): Promise<Investment[]> {
    return this.investmentsRepository.find();
  }

  async findByProject(projectId: string): Promise<Investment[]> {
    const project = await this.projectsRepository.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Projet non trouvé');
    return this.investmentsRepository.find({ where: { project: { id: projectId } } });
  }

  async findOne(id: string, user: User): Promise<Investment> {
    const investment = await this.investmentsRepository.findOne({ where: { id } });
    if (!investment) throw new NotFoundException('Investissement non trouvé');
    if (user.role !== UserRole.ADMIN && investment.investor.id !== user.id) {
      throw new ForbiddenException('Accès refusé');
    }
    return investment;
  }

  async create(dto: CreateInvestmentDto, user: User): Promise<Investment> {
    if (user.role !== UserRole.INVESTOR) {
      throw new ForbiddenException('Seuls les investisseurs peuvent investir');
    }
    const investor = await this.usersRepository.findOne({ where: { id: user.id } });
    const project = await this.projectsRepository.findOne({ where: { id: dto.projectId } });
    if (!investor || !project) throw new NotFoundException('Investisseur ou projet non trouvé');
    const investment = this.investmentsRepository.create({
      investor,
      project,
      amount: dto.amount,
    });
    return this.investmentsRepository.save(investment);
  }

  async update(id: string, amount: number, user: User): Promise<Investment> {
    const investment = await this.findOne(id, user);
    investment.amount = amount;
    return this.investmentsRepository.save(investment);
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const investment = await this.findOne(id, user);
    await this.investmentsRepository.remove(investment);
    return { message: 'Investissement supprimé avec succès' };
  }
} 