import { ApiProperty } from '@nestjs/swagger';
import { UserData } from '../../user/model';

export class LoginDto {
    @ApiProperty({ type: () => UserData })
    public readonly user: UserData;

    @ApiProperty()
    public readonly accessToken: string;

    constructor(user: UserData, accessToken: string) {
        this.user = user;
        this.accessToken = accessToken;
    }
}

export class LogoutDto {
    @ApiProperty()
    public readonly accessToken?: string;

    @ApiProperty()
    public readonly sub?: string;
}
