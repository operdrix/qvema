import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

const logger = new Logger('QVEMA');
const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  await app.listen(PORT, () =>
    logger.log(`Server is running on http://localhost:${PORT}`),
  );
}

void bootstrap();
