import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class GetClusterDto {
    @ApiPropertyOptional({
        description: 'An optional array of boundaries, each represented as [minLng, minLat, maxLng, maxLat].',
        type: Array,
        isArray: true,
        example: [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ],
    })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        // If multiple 'boundaries' query parameters exist, join them into a single array
        if (Array.isArray(value)) {
            return value.map((boundary: string) => JSON.parse(decodeURIComponent(boundary)));
        }
        return value ? [JSON.parse(decodeURIComponent(value))] : [];
    })
    boundaries: [number, number, number, number][];

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'date (format YYYY-MM-DD)',
    })
    date?: string;
}
