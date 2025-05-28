import * as dotenv from 'dotenv';
dotenv.config(); // Charger les variables d'environnement

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
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
  await app.listen(PORT, () =>
    logger.log(`Server is running on http://localhost:${PORT}`),
  );
}

void bootstrap();
