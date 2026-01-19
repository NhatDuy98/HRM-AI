import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put, // Added Put
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from '../../common';
import { Auth, AuthUser } from '../../common/decorator';
import { ResponsePageDto } from '../../common/dto/response-page.dto';
import { Role } from '../../common/utils';
import { UserInputPipe, UserUpdatePipe } from '../flow/user.pipe';
import { UserData, UserFilter, UserInput, UserPayload, UserUpdate } from '../model';
import { UserService } from '../service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UsersController {
    public constructor(private readonly userService: UserService) { }

    @Get('/')
    @ApiOperation({ summary: 'Find users' })
    @ApiResponse({ status: HttpStatus.OK, type: ResponsePageDto<UserData> })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    public async find(
        @Query(new ValidationPipe({ transform: true }))
        filter: UserFilter,
    ): Promise<ResponsePageDto<UserData>> {
        const response = await this.userService.findAllService(filter);

        return response;
    }

    @Get('me')
    @ApiOperation({ summary: 'User me' })
    @ApiResponse({ status: HttpStatus.OK, type: UserData })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    public async getMe(@AuthUser() user: UserPayload): Promise<UserData> {
        const data = await this.userService.findByIdService(user.id);
        return plainToInstance(UserData, data);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find user' })
    @ApiResponse({ status: HttpStatus.OK, type: UserData })
    @Auth([Role.ADMIN])
    public async findById(@Param('id') id: string): Promise<UserData> {
        const user = await this.userService.findByIdService(id);

        if (!user) {
            throw new NotFoundException('Not found');
        } else {
            return plainToInstance(UserData, user);
        }
    }

    @Post('/')
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: HttpStatus.CREATED, type: UserData })
    @Auth([Role.ADMIN])
    public async create(@Body(UserInputPipe) value: UserInput, @AuthUser() user: UserPayload): Promise<UserData> {
        return this.userService.createService(value, user.id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: HttpStatus.OK, type: UserData })
    @Auth([Role.ADMIN])
    public async update(
        @Body(UserUpdatePipe) value: UserUpdate,
        @Param('id') id: string,
        @AuthUser() user: UserPayload,
    ): Promise<UserData> {
        return this.userService.updateService(id, value, user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @Auth([Role.ADMIN])
    public async delete(@Param('id') id: string): Promise<void> {
        await this.userService.deleteService(id);
    }
}
