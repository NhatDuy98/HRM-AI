import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";


export class MultipleIdsDto {

    @ApiProperty()
    @IsArray()
    ids: string[];
}