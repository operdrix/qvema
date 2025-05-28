import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/enums/role.enum';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentResponseDto } from './dto/investment-response.dto';
import { Investment } from './entities/investment.entity';
import { InvestmentsService } from './investments.service';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) { }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<Investment[]> {
    return this.investmentsService.findAll();
  }

  @Get('project/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByProject(@Param('id') id: string): Promise<InvestmentResponseDto[]> {
    const investments = await this.investmentsService.findByProject(id);
    return investments.map(investment => new InvestmentResponseDto(investment));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Investment> {
    return this.investmentsService.findOne(id, req.user);
  }

  @Post()
  @Roles(UserRole.INVESTOR)
  async create(@Body() dto: CreateInvestmentDto, @Request() req): Promise<Investment> {
    return this.investmentsService.create(dto, req.user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body('amount') amount: number, @Request() req): Promise<Investment> {
    return this.investmentsService.update(id, amount, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<{ message: string }> {
    return this.investmentsService.remove(id, req.user);
  }
} 