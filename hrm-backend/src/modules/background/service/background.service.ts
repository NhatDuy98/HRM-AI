import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Education } from '../model/education.entity';
import { Skill } from '../model/skill.entity';
import { Achievement } from '../model/achievement.entity';
import { CreateEducationDto, CreateSkillDto, CreateAchievementDto } from '../dto/background.dto';
import { PageDto } from '../../common/dto/page.dto';
import { ResponsePageDto } from '../../common/dto/response-page.dto';
import { PageMetaDto } from '../../common/dto/meta.dto';

@Injectable()
export class BackgroundService {
    constructor(
        @InjectRepository(Education, 'appConnection')
        private readonly educationRepository: Repository<Education>,
        @InjectRepository(Skill, 'appConnection')
        private readonly skillRepository: Repository<Skill>,
        @InjectRepository(Achievement, 'appConnection')
        private readonly achievementRepository: Repository<Achievement>,
    ) { }

    // Education methods
    async findEducationByUser(userId: string, pageDto: PageDto): Promise<ResponsePageDto<Education>> {
        const [data, total] = await this.educationRepository.findAndCount({
            where: { userId },
            order: { startYear: pageDto.order }, // Or default to DESC but respect order
            take: pageDto.limit,
            skip: pageDto.skip,
            withDeleted: false
        });
        return new ResponsePageDto(data, new PageMetaDto({ pageDto, total }));
    }

    async createEducation(userId: string, dto: CreateEducationDto, createdBy: string): Promise<Education> {
        const education = this.educationRepository.create({
            ...dto,
            userId,
            createdBy,
        });
        return this.educationRepository.save(education);
    }

    async deleteEducation(id: string): Promise<void> {
        const education = await this.educationRepository.findOne({ where: { id } });
        if (!education) {
            throw new NotFoundException('Education record not found');
        }
        await this.educationRepository.softDelete(id);
    }

    // Skills methods
    async findSkillsByUser(userId: string, pageDto: PageDto): Promise<ResponsePageDto<Skill>> {
        // Since using query builder for join, we need manual pagination
        const query = this.skillRepository
            .createQueryBuilder('skill')
            .innerJoin('skill.users', 'user')
            .where('user.id = :userId', { userId })
            .skip(pageDto.skip)
            .take(pageDto.limit);

        const [data, total] = await query.getManyAndCount();
        return new ResponsePageDto(data, new PageMetaDto({ pageDto, total }));
    }

    async findAllSkills(pageDto: PageDto): Promise<ResponsePageDto<Skill>> {
        const [data, total] = await this.skillRepository.findAndCount({
            take: pageDto.limit,
            skip: pageDto.skip,
            withDeleted: false
        });
        return new ResponsePageDto(data, new PageMetaDto({ pageDto, total }));
    }

    async createSkill(dto: CreateSkillDto, createdBy: string): Promise<Skill> {
        const existing = await this.skillRepository.findOne({
            where: { name: dto.name }
        });

        if (existing) {
            return existing;
        }

        const skill = this.skillRepository.create({
            ...dto,
            createdBy,
        });
        return this.skillRepository.save(skill);
    }

    async updateUserSkills(userId: string, skillIds: string[]): Promise<void> {
        // This would require a user-skills junction table management
        // Implementation depends on how the relationship is set up
        // Placeholder for now
    }

    // Achievements methods
    async findAchievementsByUser(userId: string, pageDto: PageDto): Promise<ResponsePageDto<Achievement>> {
        const [data, total] = await this.achievementRepository.findAndCount({
            where: { userId },
            order: { date: pageDto.order },
            take: pageDto.limit,
            skip: pageDto.skip,
            withDeleted: false
        });
        return new ResponsePageDto(data, new PageMetaDto({ pageDto, total }));
    }

    async createAchievement(userId: string, dto: CreateAchievementDto, createdBy: string): Promise<Achievement> {
        const achievement = this.achievementRepository.create({
            ...dto,
            userId,
            createdBy,
        });
        return this.achievementRepository.save(achievement);
    }

    async deleteAchievement(id: string): Promise<void> {
        const achievement = await this.achievementRepository.findOne({ where: { id } });
        if (!achievement) {
            throw new NotFoundException('Achievement not found');
        }
        await this.achievementRepository.softDelete(id);
    }
}
