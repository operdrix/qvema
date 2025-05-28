import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Interest } from '../../modules/interests/entities/interest.entity';
import { Investment } from '../../modules/investments/entities/investment.entity';
import { Project } from '../../modules/projects/entities/project.entity';
import { User } from '../../modules/users/entities/user.entity';
import { interests } from './interests.fixture';
import { investments } from './investments.fixture';
import { projects } from './projects.fixture';
import { users } from './users.fixture';

@Injectable()
export class FixturesService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Investment)
    private readonly investmentsRepository: Repository<Investment>,
  ) { }

  async loadFixtures() {
    // Charger les utilisateurs
    const createdUsers = await Promise.all(
      users.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.usersRepository.create({
          ...userData,
          password: hashedPassword,
        });
        return this.usersRepository.save(user);
      }),
    );

    // Charger les centres d'intérêt
    const createdInterests = await Promise.all(
      interests.map((interestData) => {
        const interest = this.interestsRepository.create(interestData);
        return this.interestsRepository.save(interest);
      }),
    );

    // Créer un map des emails vers les utilisateurs
    const userMap = new Map(createdUsers.map(user => [user.email, user]));
    // Créer un map des noms vers les intérêts
    const interestMap = new Map(createdInterests.map(interest => [interest.name, interest]));

    // Charger les projets
    const createdProjects = await Promise.all(
      projects.map(async (projectData) => {
        const owner = userMap.get(projectData.ownerEmail);
        const projectInterests = projectData.interests
          .map(name => interestMap.get(name))
          .filter((i): i is Interest => !!i);

        const project = this.projectsRepository.create({
          title: projectData.title,
          description: projectData.description,
          budget: projectData.budget,
          category: projectData.category,
          owner,
          interests: projectInterests,
        });
        return this.projectsRepository.save(project);
      }),
    );

    // Créer un map des titres vers les projets
    const projectMap = new Map(createdProjects.map(project => [project.title, project]));

    // Charger les investissements
    await Promise.all(
      investments.map(async (investmentData) => {
        const project = projectMap.get(investmentData.projectTitle);
        const investor = userMap.get(investmentData.investorEmail);
        if (!project || !investor) return;
        const investment = this.investmentsRepository.create({
          project,
          investor,
          amount: investmentData.amount,
        });
        return this.investmentsRepository.save(investment);
      }),
    );

    return {
      users: createdUsers.length,
      interests: createdInterests.length,
      projects: createdProjects.length,
      investments: investments.length,
    };
  }
} 