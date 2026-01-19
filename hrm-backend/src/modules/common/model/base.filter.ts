import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Constant, Order } from '../utils';
import { PageDto } from '../dto';
import { Type } from 'class-transformer';

export class BaseFilter {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    default: Constant.PAGE
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  page: number = Constant.PAGE;

  @ApiProperty({
    default: Constant.LIMIT
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  limit: number = Constant.LIMIT;

  @ApiPropertyOptional({
    enum: Order,
    default: Order.DESC,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order: Order;


  @ApiPropertyOptional({
    default: Constant.SORT_COLUMN
  })
  @IsString()
  @IsOptional()
  readonly orderBy?: string = Constant.SORT_COLUMN;

  get skip() {
    return (this.page - 1) * this.limit;
  }

  get pageDto(): PageDto{
    return new PageDto(this.order, this.page, this.limit)
  }
}