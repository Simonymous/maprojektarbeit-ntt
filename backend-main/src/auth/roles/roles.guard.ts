import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    console.log("test")
    const jwtService = new JwtService(null);
    const token = context.switchToHttp().getRequest().headers.authorization
    console.log(token) 
    console.log(jwtService.decode(token))
    //const { user } = context.switchToHttp().getRequest();
    //return requiredRoles.some((role) => user.roles?.includes(role));
    //return false;
    return true;
  }
}