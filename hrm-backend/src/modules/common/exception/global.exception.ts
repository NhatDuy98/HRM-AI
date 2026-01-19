import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryFailedError } from 'typeorm';
import { AppLogger } from '../utils/logger.util';

@Catch(QueryFailedError)
export class QueryFailErrorHandle implements ExceptionFilter {
    constructor(private readonly logger: AppLogger) {}

    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();
        const status = HttpStatus.BAD_REQUEST;
        const message = exception.message;

        this.logger.error({
            message,
            statusCode: status,
            path: request.url,
            timestamp: new Date().toISOString(),
            stack: exception.stack,
        });

        response.status(status).send({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
        });
    }
}
