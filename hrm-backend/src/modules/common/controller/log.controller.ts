import { Controller, Get, Res, HttpStatus, Param } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../provider/logger.service';

@Controller('logs')
export class LoggerController {
    constructor(private readonly loggerService: LoggerService) {}

    @Get('today')
    async getTodayLog(@Res() res: Response) {
        try {
            const logStream = await this.loggerService.getTodayLog();
            res.header('Content-Disposition', `attachment; filename="${new Date().toISOString().split('T')[0]}.log"`);
            res.header('Content-Type', 'application/octet-stream');
            // Pipe the stream to the response
            return res.send(logStream);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: "Could not read today's log file",
                error: error.message,
            });
        }
    }

    @Get(':date')
    async getLogByDate(@Param('date') date: string, @Res() res: Response) {
        try {
            // Validate date format (optional, but recommended)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    message: 'Invalid date format. Use YYYY-MM-DD',
                });
            }

            const logStream = await this.loggerService.getLogByDate(date);

            res.header('Content-Disposition', `attachment; filename="${new Date().toISOString().split('T')[0]}.log"`);
            res.header('Content-Type', 'application/octet-stream');
            // Pipe the stream to the response
            return res.send(logStream);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: `Could not read log file for date ${date}`,
                error: error.message,
            });
        }
    }
}
