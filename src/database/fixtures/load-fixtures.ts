import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule, getConnectionToken } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { typeOrmConfig } from '../../config/typeorm';
import { FixturesModule } from './fixtures.module';
import { FixturesService } from './fixtures.service';
dotenv.config();

import * as readline from 'readline';

console.log('Début du script load-fixtures.ts');

async function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question + ' (o/N) ', (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'o');
    });
  });
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext({
    module: FixturesModule,
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot(typeOrmConfig),
    ],
  } as any);
  const connection = app.get(getConnectionToken());

  const confirm = await askConfirmation('Attention : toutes les données existantes vont être supprimées. Continuer ?');
  if (!confirm) {
    console.log('Opération annulée.');
    await app.close();
    return;
  }

  // Désactiver les clés étrangères, vider les tables, puis réactiver
  await connection.query('SET FOREIGN_KEY_CHECKS=0;');
  await connection.query('TRUNCATE TABLE investments;');
  await connection.query('TRUNCATE TABLE project_interests;');
  await connection.query('TRUNCATE TABLE user_interests;');
  await connection.query('TRUNCATE TABLE projects;');
  await connection.query('TRUNCATE TABLE interests;');
  await connection.query('TRUNCATE TABLE users;');
  await connection.query('SET FOREIGN_KEY_CHECKS=1;');

  const fixturesService = app.get(FixturesService);
  const result = await fixturesService.loadFixtures();
  console.log('Fixtures chargées avec succès :');
  console.log(`- ${result.users} utilisateurs`);
  console.log(`- ${result.interests} centres d'intérêt`);
  console.log(`- ${result.projects} projets`);
  console.log(`- ${result.investments} investissements`);
  await app.close();
}

bootstrap().catch(e => console.error('Erreur lors du chargement des fixtures :', e)); 