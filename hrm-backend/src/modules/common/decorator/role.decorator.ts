import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ActiveUserGuard, AuthGuard } from '../security';
import { RolesGuard } from '../security/roles.guard';
import { Role } from '../utils';

export function Auth(roles: Role[] = []): MethodDecorator {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard, ActiveUserGuard, RolesGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
