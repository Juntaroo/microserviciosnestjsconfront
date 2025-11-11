import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';

export const RolesGuard = (requiredRoles: string[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      const userRoles = req.user?.roles || [];
      return requiredRoles.some(role => userRoles.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};
