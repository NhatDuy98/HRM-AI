import { ApiProperty } from "@nestjs/swagger";

export class AuthLogin {
    @ApiProperty({ description: 'User Name', example: 'johndoe23' })
    public username: string;
    @ApiProperty({ description: 'Password' })
    public password: string;
}