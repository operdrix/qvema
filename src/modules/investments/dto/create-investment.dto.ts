import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @Min(1)
  amount: number;
} 