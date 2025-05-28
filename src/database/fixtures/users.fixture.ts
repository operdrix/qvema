import { UserRole } from '../../modules/users/enums/role.enum';

export const users = [
  {
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@qvema.com',
    password: 'admin123',
    role: UserRole.ADMIN,
  },
  {
    firstName: 'Thomas',
    lastName: 'Dubois',
    email: 'thomas.dubois@qvema.com',
    password: 'entrepreneur123',
    role: UserRole.ENTREPRENEUR,
  },
  {
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@qvema.com',
    password: 'entrepreneur123',
    role: UserRole.ENTREPRENEUR,
  },
  {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@qvema.com',
    password: 'investor123',
    role: UserRole.INVESTOR,
  },
  {
    firstName: 'Marie',
    lastName: 'Laurent',
    email: 'marie.laurent@qvema.com',
    password: 'investor123',
    role: UserRole.INVESTOR,
  },
  {
    firstName: 'Pierre',
    lastName: 'Moreau',
    email: 'pierre.moreau@qvema.com',
    password: 'investor123',
    role: UserRole.INVESTOR,
  },
  {
    firstName: 'Julie',
    lastName: 'Petit',
    email: 'julie.petit@qvema.com',
    password: 'investor123',
    role: UserRole.INVESTOR,
  },
]; 