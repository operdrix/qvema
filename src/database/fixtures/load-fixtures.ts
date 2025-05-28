import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { typeOrmConfig } from '../../config/typeorm';
import { FixturesModule } from './fixtures.module';
import { FixturesService } from './fixtures.service';
dotenv.config();

console.log('Début du script load-fixtures.ts');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext({
    module: FixturesModule,
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot(typeOrmConfig),
    ],
  } as any);
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