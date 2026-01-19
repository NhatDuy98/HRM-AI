import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { UserPayload } from '../../user/model';
import { UserService } from '../../user/service';
import { Role } from '../utils';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<Role[]>('roles', context.getHandler());

        if (isEmpty(roles)) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const requestUser = <UserPayload>request.user;
        const user = await this.userService.findByIdService(requestUser.id);

        const isRoleIncluded = roles.includes(user?.role as any);
        return isRoleIncluded;
    }
}
