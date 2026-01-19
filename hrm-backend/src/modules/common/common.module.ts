import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './controller';
import { LoggerController } from './controller/log.controller';
import { SqlController } from './controller/sql.controller';
import { LogInterceptor } from './flow';
import { configProvider, LoggerService } from './provider';
import { AppLogger } from './utils/logger.util';

@Module({
    imports: [TerminusModule],
    providers: [configProvider, LoggerService, LogInterceptor, AppLogger],
    exports: [configProvider, LoggerService, LogInterceptor, AppLogger],
    controllers: [HealthController, LoggerController, SqlController],
})
export class CommonModule {}
