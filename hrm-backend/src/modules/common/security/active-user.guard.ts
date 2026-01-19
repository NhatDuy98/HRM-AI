import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserPayload } from '../../user/model';
import { UserService } from '../../user/service';
import { UserStatus } from '../utils';

@Injectable()
export class ActiveUserGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const requestUser = <UserPayload>request.user;
        const user = await this.userService.findByIdService(requestUser.id);

        return user?.status == UserStatus.active;
    }
}
