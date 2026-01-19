import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
    private readonly instance: winston.Logger;
    private readonly logDir = './logs';

    public constructor() {
        const format = this.isProductionEnv()
            ? winston.format.combine(winston.format.timestamp(), winston.format.json())
            : winston.format.combine(winston.format.colorize(), winston.format.simple());

        this.instance = winston.createLogger({
            level: 'info',
            silent: this.isTestEnv(),
            format,
            transports: [
                new winston.transports.Console({
                    stderrLevels: ['error'],
                }),
            ],
        });
    }

    public info(message: string) {
        this.instance.info(message);
    }

    public error(message: string) {
        this.instance.error(message);
    }

    private isTestEnv(): boolean {
        return process.env.NODE_ENV === 'test';
    }

    private isProductionEnv(): boolean {
        return process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
    }

    async getTodayLog(): Promise<Readable> {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const logFilePath = path.join(this.logDir, `${today}.log`);

        // Check if file exists
        if (!fs.existsSync(logFilePath)) {
            throw new Error(`Log file for today (${today}) does not exist`);
        }

        // Read and return file content
        return fs.createReadStream(logFilePath, { encoding: 'utf8' });
    }

    async getLogByDate(date: string): Promise<Readable> {
        const logFilePath = path.join(this.logDir, `${date}.log`);

        // Check if file exists
        if (!fs.existsSync(logFilePath)) {
            throw new Error(`Log file for ${date} does not exist`);
        }

        // Read and return file content
        return fs.createReadStream(logFilePath, { encoding: 'utf8' });
    }
}
