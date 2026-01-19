import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { DocumentType, DocumentStatus } from '../model/document.entity';

export class UploadDocumentDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ enum: DocumentType })
    @IsEnum(DocumentType)
    type: DocumentType;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;
}

export class DocumentResponseDto {
    id: string;
    userId: string;
    name: string;
    type: DocumentType;
    status: DocumentStatus;
    filePath: string;
    fileSize: number;
    version: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
