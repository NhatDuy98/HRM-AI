import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();
const configService = new ConfigService();
export default new DataSource({
    type: 'postgres',
    host: configService.get<string>('APP_DB_HOST'),
    port: configService.get<number>('APP_DB_PORT'),
    username: configService.get<string>('APP_DB_USERNAME'),
    password: configService.get<string>('APP_DB_PASSWORD'),
    schema: configService.get<string>('APP_DB_SCHEMA'),
    database: configService.get<string>('APP_DB_DATABASE'),
    synchronize: configService.get<string>('APP_DB_SYNCHRONIZE') == 'true' ? true : false,
    migrations: ['dist/migrations/**/*.js'],
    entities: [
        ...(process.env.NODE_ENV === 'production'
            ? ['dist/**/*.entity.js']
            : configService
                .get<string>('APP_DB_ENTITIES', '')
                .split(',')
                .filter(Boolean)
                .filter((p) => p.endsWith('.js') || p.endsWith('.ts'))),
    ],
});
