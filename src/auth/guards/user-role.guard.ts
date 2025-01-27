import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators';


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {
    
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if ( !validRoles ) {
      return true;  // cualquier persona puede entrar 
    }

    if ( validRoles.length === 0 )return true; // puede pasar cualquiera

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if ( !user ) {
      throw new BadRequestException('Usuario no encontrado');
    }

    for ( const role of user.roles ) {
      if ( validRoles.includes( role )) {
        return true;
      }
    }
    
    throw new ForbiddenException(`Usuario ${user.fullName}, no tiene rol ${validRoles} `);
  }
}
