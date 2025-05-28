import * as dotenv from 'dotenv';
dotenv.config(); // Charger les variables d'environnement

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception.filter';
import { AppDataSource } from './config/datasource';

const logger = new Logger('QVEMA');
const PORT = process.env.PORT ?? 3000;

async function bootstrap() {

  await AppDataSource.initialize()
    .then(() => {
      logger.log('Data Source has been initialized!');
    })
    .catch((err) => {
      logger.error('Error during Data Source initialization', err);
    });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Activation de la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans le DTO
    transform: true, // Transforme automatiquement les types
    forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés non définies
  }));

  // Activation du filtre d'exception global
  app.useGlobalFilters(new TypeOrmExceptionFilter());

  await app.listen(PORT, () =>
    logger.log(`Server is running on http://localhost:${PORT}`),
  );
}

void bootstrap();
