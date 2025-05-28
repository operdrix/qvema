import { DataSource } from 'typeorm';
import { typeOrmConfig } from './typeorm';

export const AppDataSource = new DataSource(typeOrmConfig);