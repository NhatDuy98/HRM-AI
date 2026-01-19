import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ApplicationModule } from './modules/app.module';
import { CommonModule, LogInterceptor } from './modules/common';
import { QueryFailErrorHandle } from './modules/common/exception';
import compression from '@fastify/compress';
import fastyfyMultipart from '@fastify/multipart';
import { AppLogger } from './modules/common/utils/logger.util';

/**
 * These are API defaults that can be changed using environment variables,
 * it is not required to change them (see the `.env.example` file)
 */
const API_DEFAULT_PORT = 3000;
const API_DEFAULT_PREFIX = '/api/v1/';

/**
 * The defaults below are dedicated to Swagger configuration, change them
 * following your needs (change at least the title & description).
 *
 * @todo Change the constants below following your API requirements
 */
const SWAGGER_TITLE = 'MLMT API';
const SWAGGER_DESCRIPTION = 'API used for MLMT management';
const SWAGGER_PREFIX = '/docs';

/**
 * Register a Swagger module in the NestJS application.
 * This method mutates the given `app` to register a new module dedicated to
 * Swagger API documentation. Any request performed on `SWAGGER_PREFIX` will
 * receive a documentation page as response.
 *
 * @todo See the `nestjs/swagger` NPM package documentation to customize the
 *       code below with API keys, security requirements, tags and more.
 */
function createSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_PREFIX, app, document);
}

/**
 * Build & bootstrap the NestJS API.
 * This method is the starting point of the API; it registers the application
 * module and registers essential components such as the logger and request
 * parsing middleware.
 */

const bodyLimit = process.env.BODY_LIMIT ? parseInt(process.env.BODY_LIMIT) * 1024 * 1024 : 5 * 1024 * 1024;

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
        ApplicationModule,
        new FastifyAdapter({
            bodyLimit: bodyLimit,
            connectionTimeout: 300000, // 5 minutes
            keepAliveTimeout: 301000,
            requestTimeout: 302000,
        }),
    );

    // Configure the underlying HTTP server timeouts
    const server = app.getHttpServer();
    server.keepAliveTimeout = 301000;
    server.headersTimeout = 302000;

    app.register(fastyfyMultipart as any);
    await app.register(compression, {
        encodings: ['gzip'],
        threshold: 0,
    });
    // @todo Enable Helmet for better API security headers
    app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);

    if (!process.env.SWAGGER_ENABLE || process.env.SWAGGER_ENABLE === '1') {
        createSwagger(app);
    }
    app.enableCors({ origin: '*' });

    const logInterceptor = app.select(CommonModule).get(LogInterceptor);
    app.useGlobalInterceptors(logInterceptor);
    app.useGlobalFilters(new QueryFailErrorHandle(app.get(AppLogger)));

    process.on('SIGTERM', async () => {
        console.log('[DEBUG] SIGTERM received, closing application...');
        await app.close();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        console.log('[DEBUG] SIGINT received, closing application...');
        await app.close();
        process.exit(0);
    });

    await app.listen({
        port: parseInt(process.env.API_PORT ?? API_DEFAULT_PORT.toString(), 10),
        host: '0.0.0.0',
    });
}

/**
 * It is now time to turn the lights on!
 * Any major error that can not be handled by NestJS will be caught in the code
 * below. The default behavior is to display the error on stdout and quit.
 *
 * @todo It is often advised to enhance the code below with an exception-catching
 *       service for better error handling in production environments.
 */
bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);

    const defaultExitCode = 1;
    process.exit(defaultExitCode);
});
