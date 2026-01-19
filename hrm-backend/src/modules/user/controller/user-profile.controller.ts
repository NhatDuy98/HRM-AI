import { Body, Controller, Get, Param, Post, Put, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common';
import { UserProfileService } from '../service/user-profile.service';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';

@ApiTags('user-profile')
@Controller('user-profile')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@Request() req: any) {
        const userId = req.user?.id || 'test-user-id'; // Replace with actual user from JWT
        return this.userProfileService.getFullProfile(userId);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Update user profile' })
    async updateProfile(
        @Request() req: any,
        @Body() updateDto: UpdateUserProfileDto
    ) {
        const userId = req.user?.id || 'test-user-id';
        const updatedBy = req.user?.id || 'SYSTEM';
        return this.userProfileService.updateProfile(userId, updateDto, updatedBy);
    }

    @Get('security')
    @ApiOperation({ summary: 'Get account security information' })
    async getSecurityInfo(@Request() req: any) {
        // Stub - would return password change history, 2FA status, etc.
        return {
            lastPasswordChange: new Date(),
            twoFactorEnabled: false,
            loginAttempts: 0
        };
    }

    @Get('audit-logs')
    @ApiOperation({ summary: 'Get user activity audit logs' })
    async getAuditLogs(@Request() req: any) {
        // Stub - would return user activity history
        return {
            activities: [],
            total: 0
        };
    }
}
