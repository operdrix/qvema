// src/users/user.repository.ts
import { AppDataSource } from 'src/config/datasource';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

const UsersRepository = AppDataSource.getRepository(User).extend({
  findByName(this: Repository<User>, firstName: string, lastName: string) {
    return this.createQueryBuilder('user')
      .where('user.firstName = :firstName', { firstName })
      .andWhere('user.lastName = :lastName', { lastName })
      .getMany();
  },

  findOneByEmail(this: Repository<User>, email: string) {
    return this.findOne({
      where: { email },
    });
  },
});

export default UsersRepository;
export type UsersRepositoryType = typeof UsersRepository;