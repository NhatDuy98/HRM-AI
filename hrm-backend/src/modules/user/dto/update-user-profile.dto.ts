import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class UpdateUserProfileDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    nationalId?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    gender?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    department?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    position?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    workEmail?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    dateOfJoining?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string;
}
