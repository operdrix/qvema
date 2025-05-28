import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/enums/role.enum';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const isSelfOrAdmin = this.reflector.getAllAndOverride<boolean>('selfOrAdmin', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isSelfOrAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    // Si l'utilisateur est admin, il a toujours accès
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Sinon, vérifier si l'utilisateur modifie son propre profil
    if (user.id !== params.id) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre profil');
    }

    return true;
  }
} 