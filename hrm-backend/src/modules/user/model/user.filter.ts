import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseFilter } from '../../common/model/base.filter';
import { Role, UserStatus } from '../../common/utils';

export class UserFilter extends BaseFilter {
    @ApiPropertyOptional({
        enum: UserStatus,
    })
    @Type(() => String)
    @IsOptional()
    status?: string;

    @ApiPropertyOptional({
        enum: Role,
    })
    @Type(() => String)
    @IsOptional()
    role?: string;
}
