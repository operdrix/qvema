import { ConflictException } from '@nestjs/common';

export class DuplicateEntryException extends ConflictException {
  constructor(field: string) {
    super(`Un enregistrement avec cet ${field} existe déjà.`);
  }
} 