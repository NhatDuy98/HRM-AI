import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('sql')
export class SqlController {
    constructor(
        @InjectDataSource('appConnection')
        private dataSource: DataSource,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Execute SQL Query', description: 'Executes a raw SQL query and returns the results.' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                sql: { type: 'string', description: 'The raw SQL query to execute.' },
                token: { type: 'string', description: 'The admin token to authenticate the request.' },
            },
            required: ['sql', 'token'],
        },
    })
    async executeSql(@Body('sql') sql: string, @Body('token') token: any): Promise<any> {
        if (token !== process.env.ADMIN_TOKEN) {
            throw new BadRequestException('You don\'t have permission to execute SQL queries.');
        }
        const ignores = ['DROP', 'DELETE', 'TRUNCATE'];
        if (ignores.some((keyword) => sql.toUpperCase().includes(keyword))) {
            throw new BadRequestException('The SQL query contains forbidden keywords.');
        }
        return this.dataSource.query(sql);
    }
}
