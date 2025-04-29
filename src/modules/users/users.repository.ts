import { EntityRepository, Repository } from "typeorm";
import { User } from "./entities/user.entity";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.create(userData);
    return this.save(user);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    await this.update(id, userData);
    return this.findById(id);
  }
}