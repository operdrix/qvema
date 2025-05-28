import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DuplicateEntryException } from '../exceptions/duplicate-entry.exception';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Vérifier si c'est une erreur de duplication
    if (exception.message.includes('Duplicate entry')) {
      // Extraire la valeur en doublon
      const duplicateValue = exception.message.match(/Duplicate entry '([^']+)'/)?.[1];

      // Déterminer le champ en doublon
      let field = 'champ';
      if (duplicateValue?.includes('@')) {
        field = 'email';
      }

      throw new DuplicateEntryException(field);
    }

    // Pour les autres erreurs TypeORM
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Une erreur est survenue lors de l\'opération sur la base de données',
      error: 'Database Error'
    });
  }
} 