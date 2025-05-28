import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/enums/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @Roles(UserRole.ENTREPRENEUR)
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req): Promise<Project> {
    return await this.projectsService.create(createProjectDto, req.user);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectsService.findAll();
  }

  @Get('my-projects')
  async findMyProjects(@Request() req): Promise<Project[]> {
    return await this.projectsService.findByOwner(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return await this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ENTREPRENEUR)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: Partial<CreateProjectDto>,
    @Request() req,
  ): Promise<Project> {
    return await this.projectsService.update(id, updateProjectDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Request() req): Promise<{ message: string }> {
    return await this.projectsService.remove(id, req.user);
  }
} 