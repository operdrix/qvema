import { User } from 'src/modules/users/entities/user.entity';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';


console.log('Environment variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
});

const config: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'qvema',
  synchronize: process.env.NODE_ENV !== 'production', // Only synchronize in development
  ssl: false,
  entities: [User],
};

console.log('Database configuration:', {
  host: config.host,
  port: config.port,
  username: config.username,
  database: config.database,
});

export const typeOrmConfig = config;