import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class AppLogger implements LoggerService {
    private readonly logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info', // Log level
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}]: ${message}`;
                }),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.DailyRotateFile({
                    dirname: './logs', // Directory where logs will be saved
                    filename: '%DATE%.log', // File naming pattern based on date
                    datePattern: 'YYYY-MM-DD', // Date format for filename
                    zippedArchive: true, // Optional: compress old log files
                    maxFiles: '14d', // Keep log files for the last 14 days
                }),
            ],
        });
    }

    log(message: any) {
        this.logger.info(this.stringifyMessage(message));
    }

    error(message: any, trace?: string) {
        this.logger.error(this.stringifyMessage(message), trace);
    }

    warn(message: any) {
        this.logger.warn(this.stringifyMessage(message));
    }

    debug(message: any) {
        this.logger.debug(this.stringifyMessage(message));
    }

    verbose(message: any) {
        this.logger.verbose(this.stringifyMessage(message));
    }

    private stringifyMessage(message: any): string {
        if (typeof message === 'object' || Array.isArray(message)) {
            return JSON.stringify(message, null, 2); // Pretty-print objects and arrays
        }
        return message.toString(); // Convert other types to string
    }
}
