import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { AchievementType } from '../model/achievement.entity';

export class CreateEducationDto {
    @ApiProperty()
    @IsString()
    degree: string;

    @ApiProperty()
    @IsString()
    institution: string;

    @ApiPropertyOptional()
    @IsInt()
    @IsOptional()
    startYear?: number;

    @ApiPropertyOptional()
    @IsInt()
    @IsOptional()
    endYear?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    fieldOfStudy?: string;
}

export class CreateSkillDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    category?: string;
}

export class CreateAchievementDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    date?: string;

    @ApiProperty({ enum: AchievementType })
    @IsEnum(AchievementType)
    type: AchievementType;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    issuer?: string;
}

export class UpdateUserSkillsDto {
    @ApiProperty({ type: [String] })
    skillIds: string[];
}
