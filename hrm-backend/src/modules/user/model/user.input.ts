import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { UserData } from './user.data';

export class UserInput extends PickType(UserData, [
    'username',
    'company',
    'department',
    'role',
    'status',
    'email',
    'observationArea',
    'name',
    'position',
] as const) {}

export class UserUpdate extends UserInput {}
