import { BadRequestException, Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthOidcService, AuthService } from '../service';

@ApiTags('Auth Oidc')
@Controller('auth-oidc')
export class AuthOidcController {
    constructor(private authOidcService: AuthOidcService, private readonly authService: AuthService) {}

    @Get('login')
    async login() {
        const authUrl = this.authOidcService.getAuthUrl();
        return authUrl;
    }

    @Get('callback')
    async callback(@Req() req: FastifyRequest) {
        try {
            const code = (req as any).query.code as string;
            if (!code) {
                throw new Error('Authorization code missing.');
            }
            const tokenSet = await this.authOidcService.handleCallback(req);
            if (!tokenSet.access_token) {
                throw new Error('Failed to obtain access token.');
            }

            const data = await this.authService.loginWithOidc(tokenSet.claims().email ?? tokenSet.claims().sub);

            return {
                ...data,
                oidc: {
                    tokenSet,
                    sub: tokenSet.claims().sub,
                },
            };
        } catch (error) {
            console.error('SSO Callback Error:', error.message);
            throw new BadRequestException(error.message);
        }
    }
}
