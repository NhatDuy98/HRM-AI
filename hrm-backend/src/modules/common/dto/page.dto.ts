import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Constant, Order } from '../utils';

export class PageDto {
  @ApiPropertyOptional({
    enum: Order,
    default: Order.ASC,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: Constant.PAGE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(Constant.PAGE)
  @IsOptional()
  readonly page: number = Constant.PAGE;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: Constant.LIMIT,
  })
  @Type(() => Number)
  @IsInt()
  @Min(Constant.PAGE)
  @Max(50)
  @IsOptional()
  readonly limit: number = Constant.LIMIT;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  constructor(order: Order, page: number, limit: number){
    this.order = order;
    this.page = page;
    this.limit = limit;
  }
}