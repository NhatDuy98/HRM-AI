import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { Client, Issuer, TokenSet } from 'openid-client';
import { LogoutDto } from '../model';

@Injectable()
export class AuthOidcService {
    private oidcClient: Client;

    constructor(private configService: ConfigService, private readonly httpService: HttpService) {
        this.initializeOidcClient();
    }

    async initializeOidcClient() {
        const issuerUrl =
            this.configService.get<string>('SSO_ISSUER_URL') ||
            'https://auth-sso2fa.mobifone.vn:8080/oauth/realms/sso-mobifone/';
        const issuer = await Issuer.discover(issuerUrl);

        this.oidcClient = new issuer.Client({
            client_id: this.configService.get<string>('SSO_CLIENT_ID')!,
            client_secret: this.configService.get<string>('SSO_CLIENT_SECRET')!,
            redirect_uris: [this.configService.get<string>('SSO_REDIRECT_URI')!],
            response_types: ['code'],
        });
    }

    getAuthUrl(): string {
        return this.oidcClient.authorizationUrl({
            scope: 'openid profile email',
            redirect_uri: this.configService.get<string>('SSO_REDIRECT_URI'),
        });
    }

    async handleCallback(req: FastifyRequest): Promise<TokenSet> {
        const params = this.oidcClient.callbackParams(req as any);
        const tokenSet = await this.oidcClient.callback(this.configService.get<string>('SSO_REDIRECT_URI'), params);
        return tokenSet;
    }

    async getUserInfo(tokenSet: TokenSet) {
        if (tokenSet.access_token) {
            const userInfo = await this.oidcClient.userinfo(tokenSet.access_token!);
            return userInfo;
        }
        return null;
    }

    async logout(body: LogoutDto) {
        if (body.accessToken && body.sub) {
            await this.httpService.get('https://auth-sso2fa.mobifone.vn:8015/logout', {
                headers: {
                    Authorization: `Bearer ${body.accessToken}`,
                },
                params: {
                    id_token_hint: body.sub,
                },
                proxy: false,
            });
        }
    }
}
