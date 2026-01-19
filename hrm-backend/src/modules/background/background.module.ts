import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './model/education.entity';
import { Skill } from './model/skill.entity';
import { Achievement } from './model/achievement.entity';
import { BackgroundService } from './service/background.service';
import { BackgroundController } from './controller/background.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Education, Skill, Achievement], 'appConnection'),
    ],
    controllers: [BackgroundController],
    providers: [BackgroundService],
    exports: [BackgroundService],
})
export class BackgroundModule { }
