import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActiveUserGuard, AuthGuard } from '../../common';
import { AuthUser } from '../../common/decorator';
import { UserPayload } from '../../user/model';
import { UserService } from '../../user/service';
import { AuthLogin, LoginDto, LogoutDto } from '../model';
import { AuthOidcService, AuthService } from '../service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    public constructor(
        private readonly authService: AuthService,
        private readonly authOidcService: AuthOidcService,
        private readonly userService: UserService,
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: HttpStatus.OK, type: LoginDto })
    public async login(@Body() authLogin: AuthLogin): Promise<LoginDto> {
        const userLogin = await this.authService.login(authLogin);

        return userLogin;
    }

    // @Post('register')
    // @ApiOperation({ summary: 'Register' })
    // @ApiResponse({ status: HttpStatus.CREATED, type: UserData })
    // public async register(@Body(UserInputPipe) userRegister: UserInput): Promise<UserData> {
    //     const user = await this.userService.createService(userRegister);
    //     return user;
    // }

    // [TODO] Test purpose
    // @Get(':id/access-token')
    // public async register(@Param('id') id: string): Promise<any> {
    //     const user = await this.userService.findByIdService(id);
    //     if (user) {
    //         return this.authService.generateAccessToken(user);
    //     }
    //     return null;
    // }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh Token' })
    @ApiResponse({ status: HttpStatus.OK })
    @ApiBearerAuth()
    @UseGuards(AuthGuard, ActiveUserGuard)
    public async refreshToken(@AuthUser() user: UserPayload): Promise<LoginDto> {
        const response = await this.authService.refreshToken(user);

        return response;
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout' })
    @ApiResponse({ status: HttpStatus.OK })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    public async logout(@AuthUser() user: UserPayload, @Body() body: LogoutDto): Promise<void> {
        await this.authService.logoutService(user);
        await this.authOidcService.logout(body);
    }
}
