import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export abstract class BaseData {
    @ApiProperty({ description: 'Unique ID', example: "2aa21734-24f6-4503-94ca-f8e248d26a17" })
    public readonly id: string;

    @ApiProperty({ description: 'Created At', example: Date.now() })
    public readonly createdAt: Date;

    @ApiProperty({ description: 'Updated At', example: Date.now() })
    public readonly updatedAt: Date;

    @ApiProperty({ description: 'Created By', example: "2aa21734-24f6-4503-94ca-f8e248d26a17" })
    public readonly createdBy: string;

    @ApiProperty({ description: 'Updated By', example: "2aa21734-24f6-4503-94ca-f8e248d26a17" })
    public readonly updatedBy: string;

    @ApiProperty({ description: 'Soft Delete', example: Date.now() })
    @Exclude()
    public readonly deletedAt: Date;
}