import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../model/user-profile.entity';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UserProfile, 'appConnection')
        private readonly userProfileRepository: Repository<UserProfile>,
    ) { }

    async findByUserId(userId: string): Promise<UserProfile | null> {
        return this.userProfileRepository.findOne({
            where: { userId },
            withDeleted: false
        });
    }

    async createProfile(userId: string, createdBy: string): Promise<UserProfile> {
        const profile = this.userProfileRepository.create({
            userId,
            fullName: '',
            createdBy,
        });
        return this.userProfileRepository.save(profile);
    }

    async updateProfile(
        userId: string,
        updateDto: UpdateUserProfileDto,
        updatedBy: string
    ): Promise<UserProfile> {
        let profile = await this.findByUserId(userId);

        if (!profile) {
            profile = await this.createProfile(userId, updatedBy);
        }

        Object.assign(profile, updateDto);
        profile.updatedBy = updatedBy;

        return this.userProfileRepository.save(profile);
    }

    async getFullProfile(userId: string): Promise<UserProfile> {
        const profile = await this.userProfileRepository.findOne({
            where: { userId },
            relations: ['user'],
            withDeleted: false
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        return profile;
    }
}
