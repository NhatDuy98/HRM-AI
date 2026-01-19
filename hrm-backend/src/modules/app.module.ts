import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common';
import { MyCacheModule } from './common/cache/cache.module';
import { JsonClobSubscriber } from './common/middleware/type-orm.middleware';
import { QUEUES } from './common/utils';
import { UserModule } from './user/user.module';
import { DocumentsModule } from './documents/documents.module';
import { BackgroundModule } from './background/background.module';
import * as https from 'https';

// function assertEnv(name: string): string {
//   const env = process.env[name];
//   if (typeof env !== "string" || !env) {
//     throw new Error(`Expected environment variable ${name}`);
//   }

//   return env;
// }

@Module({
    imports: [
        CommonModule,
        BullModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                connection: {
                    host: configService.get<string>('REDIS_HOST', 'localhost'),
                    port: configService.get<number>('REDIS_PORT', 6379),
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({
            name: QUEUES.CLUSTER_QUEUE,
            defaultJobOptions: {
                attempts: 1,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: true,
                removeOnFail: true,
            },
        }),
        ScheduleModule.forRoot(),
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                timeout: 15 * 60 * 1000, // 15 minutes
                maxRedirects: configService.get<number>('HTTP_MAX_REDIRECTS'),
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                }),
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'client'),
        }),
        TypeOrmModule.forRootAsync({
            name: 'appConnection',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('APP_DB_HOST'),
                port: configService.get<number>('APP_DB_PORT'),
                username: configService.get<string>('APP_DB_USERNAME'),
                password: configService.get<string>('APP_DB_PASSWORD'),
                database: configService.get<string>('APP_DB_DATABASE'),
                synchronize: configService.get<string>('APP_DB_SYNCHRONIZE') == 'true' ? true : false,
                schema: configService.get<string>('APP_DB_SCHEMA'),
                entities: [
                    ...(process.env.NODE_ENV === 'production'
                        ? [__dirname + '/../**/*.entity.js']
                        : configService.get<string>('APP_DB_ENTITIES', '').split(',')),
                ],
                subscribers: [JsonClobSubscriber],
            }),
            inject: [ConfigService],
        }),
        MyCacheModule,
        // Data Warehouse Database
        // TypeOrmModule.forRootAsync({
        //     name: 'warehouseConnection',
        //     imports: [ConfigModule],
        //     useFactory: (configService: ConfigService) => ({
        //         type: 'oracle',
        //         host: configService.get<string>('WAREHOUSE_DB_HOST'),
        //         port: configService.get<number>('WAREHOUSE_DB_PORT'),
        //         serviceName: configService.get<string>('WAREHOUSE_DB_DATABASE'),
        //         username: configService.get<string>('WAREHOUSE_DB_USERNAME'),
        //         password: configService.get<string>('WAREHOUSE_DB_PASSWORD'),
        //         synchronize: configService.get<boolean>('WAREHOUSE_DB_SYNCHRONIZE'),
        //     }),
        //     inject: [ConfigService],
        // }),
        // PassengerModule,
        AuthModule,
        UserModule,
        DocumentsModule,
        BackgroundModule,
    ],
    controllers: [],
    providers: [],
})
export class ApplicationModule { }
