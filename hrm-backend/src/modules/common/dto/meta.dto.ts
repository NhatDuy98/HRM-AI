import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from './page.dto';

interface IPageMetaDto {
  pageDto: PageDto;
  total: number;
}

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly totalPage: number;

  constructor({ pageDto, total }: IPageMetaDto) {
    this.page = pageDto.page;
    this.limit = pageDto.limit;
    this.total = total;
    this.totalPage = Math.ceil(total / this.limit);
  }
}