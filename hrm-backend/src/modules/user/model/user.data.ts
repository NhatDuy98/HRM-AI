import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BaseData } from '../../common/model/base.data';
import { Role, UserStatus } from '../../common/utils';

export class UserData extends BaseData {
    @ApiProperty({ description: 'User name', example: 'johndoe123' })
    public readonly username: string;

    @ApiProperty({ description: 'Password', example: 'Passw@rd!' })
    @Exclude()
    public readonly password: string;

    @ApiProperty({ description: 'Is Login', example: true })
    public readonly isLogin: boolean;

    @ApiProperty({ description: 'Role', example: 'ADMIN', enum: Role })
    public readonly role: string;

    @ApiProperty({
        description: 'Token',
        example:
            'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJERUZBVUxUX0lTU1VFUiIsImlhdCI6MTYzMTEwNDMzNCwicm9sZSI6InJlc3RyaWN0ZWQifQ.o2HcQBBpx-EJMcUFiqmAiD_jZ5J92gRDOyhybT9FakE',
    })
    @Exclude()
    public readonly token: string;

    @ApiProperty({})
    public company: string;

    @ApiProperty({})
    public department: string;

    @ApiProperty({ enum: UserStatus, example: UserStatus.active })
    public status: string;

    @ApiProperty({})
    public lastLogin: Date;

    @ApiProperty({})
    public accessCount: number;

    @ApiProperty({
        default: '[]',
        example: '[a6f0c859-43af-4fac-bb95-290fe44ce533","c392ad7b-6e86-46bd-b1fc-a5238d2f1469"]',
    })
    public observationArea: string;

    @ApiProperty({})
    public name: string;

    @ApiProperty({})
    public position: string;

    @ApiProperty({ default: 'test@gmail.com' })
    @IsEmail()
    public email: string;

    @Exclude()
    public sub: string;
}

export class UserPayload {
    @ApiProperty({ description: 'ID', example: 1 })
    public readonly id: string;

    @ApiProperty({ description: 'User name', example: 'johndoe123' })
    public readonly username: string;

    @ApiProperty({ description: 'Role', example: 'Admin' })
    public readonly role: string;
}
