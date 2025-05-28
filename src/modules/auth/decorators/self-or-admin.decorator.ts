import { SetMetadata } from '@nestjs/common';

export const SELF_OR_ADMIN_KEY = 'selfOrAdmin';
export const SelfOrAdmin = () => SetMetadata(SELF_OR_ADMIN_KEY, true); 