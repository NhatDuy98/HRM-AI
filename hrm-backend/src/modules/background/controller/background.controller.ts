import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common';
import { BackgroundService } from '../service/background.service';
import {
    CreateEducationDto,
    CreateSkillDto,
    CreateAchievementDto,
    UpdateUserSkillsDto
} from '../dto/background.dto';
import { PageDto } from '../../common/dto/page.dto';
import { Query, ValidationPipe } from '@nestjs/common';


@ApiTags('Background')
@Controller('background')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class BackgroundController {
    constructor(private readonly backgroundService: BackgroundService) { }

    // Education endpoints
    @Get('education')
    @ApiOperation({ summary: 'Get user education history' })
    async getEducation(
        @Request() req: any,
        @Query(new ValidationPipe({ transform: true })) pageDto: PageDto
    ) {
        const userId = req.user?.id || 'test-user-id';
        return this.backgroundService.findEducationByUser(userId, pageDto);
    }

    @Post('education')
    @ApiOperation({ summary: 'Add new education record' })
    async createEducation(
        @Request() req: any,
        @Body() createDto: CreateEducationDto
    ) {
        const userId = req.user?.id || 'test-user-id';
        const createdBy = req.user?.id || 'SYSTEM';
        return this.backgroundService.createEducation(userId, createDto, createdBy);
    }

    @Delete('education/:id')
    @ApiOperation({ summary: 'Delete education record' })
    async deleteEducation(@Param('id') id: string) {
        await this.backgroundService.deleteEducation(id);
        return { message: 'Education record deleted' };
    }

    // Skills endpoints
    @Get('skills')
    @ApiOperation({ summary: 'Get user skills' })
    async getSkills(
        @Request() req: any,
        @Query(new ValidationPipe({ transform: true })) pageDto: PageDto
    ) {
        const userId = req.user?.id || 'test-user-id';
        return this.backgroundService.findSkillsByUser(userId, pageDto);
    }

    @Get('skills/all')
    @ApiOperation({ summary: 'Get all available skills' })
    async getAllSkills(
        @Query(new ValidationPipe({ transform: true })) pageDto: PageDto
    ) {
        return this.backgroundService.findAllSkills(pageDto);
    }

    @Post('skills')
    @ApiOperation({ summary: 'Create or add skill' })
    async createSkill(
        @Request() req: any,
        @Body() createDto: CreateSkillDto
    ) {
        const createdBy = req.user?.id || 'SYSTEM';
        return this.backgroundService.createSkill(createDto, createdBy);
    }

    @Put('skills')
    @ApiOperation({ summary: 'Update user skills' })
    async updateUserSkills(
        @Request() req: any,
        @Body() updateDto: UpdateUserSkillsDto
    ) {
        const userId = req.user?.id || 'test-user-id';
        await this.backgroundService.updateUserSkills(userId, updateDto.skillIds);
        return { message: 'Skills updated successfully' };
    }

    // Achievements endpoints
    @Get('achievements')
    @ApiOperation({ summary: 'Get user achievements' })
    async getAchievements(
        @Request() req: any,
        @Query(new ValidationPipe({ transform: true })) pageDto: PageDto
    ) {
        const userId = req.user?.id || 'test-user-id';
        return this.backgroundService.findAchievementsByUser(userId, pageDto);
    }

    @Post('achievements')
    @ApiOperation({ summary: 'Add new achievement' })
    async createAchievement(
        @Request() req: any,
        @Body() createDto: CreateAchievementDto
    ) {
        const userId = req.user?.id || 'test-user-id';
        const createdBy = req.user?.id || 'SYSTEM';
        return this.backgroundService.createAchievement(userId, createDto, createdBy);
    }

    @Delete('achievements/:id')
    @ApiOperation({ summary: 'Delete achievement' })
    async deleteAchievement(@Param('id') id: string) {
        await this.backgroundService.deleteAchievement(id);
        return { message: 'Achievement deleted' };
    }

    @Post('verification-request')
    @ApiOperation({ summary: 'Request profile verification' })
    async requestVerification(@Request() req: any) {
        // Stub for verification workflow
        return {
            message: 'Verification request submitted',
            status: 'pending'
        };
    }
}
