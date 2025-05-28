import { Exclude, Expose, Type } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Investment } from '../entities/investment.entity';

@Exclude()
export class InvestmentResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => User)
  investor: User;

  @Expose()
  amount: number;

  @Expose()
  date: Date;

  constructor(investment: Investment) {
    Object.assign(this, investment);
  }
} 