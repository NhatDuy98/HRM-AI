import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthOidcService, AuthService } from './service';
import { AuthController, AuthOidcController } from './controller';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                timeout: 15 * 60 * 1000, // 15 minutes
                maxRedirects: configService.get<number>('HTTP_MAX_REDIRECTS'),
            }),
            inject: [ConfigService],
        }),
        TerminusModule,
        UserModule,
        CommonModule,
    ],
    providers: [AuthService, AuthOidcService],
    exports: [AuthService, AuthOidcService],
    controllers: [AuthController, AuthOidcController],
})
export class AuthModule {}
