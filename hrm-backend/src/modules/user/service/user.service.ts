import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PageMetaDto } from '../../common/dto';
import { ResponsePageDto } from '../../common/dto/response-page.dto';
import { getPasswordHash, Role, UserStatus } from '../../common/utils';
import { User, UserData, UserFilter, UserInput, UserUpdate } from '../model';

@Injectable()
export class UserService {
    public constructor(
        @InjectRepository(User, 'appConnection')
        private readonly userRepository: Repository<User>,
    ) {}

    public async findAllService(filter: UserFilter): Promise<ResponsePageDto<UserData>> {
        const query = this.userRepository.createQueryBuilder('users');

        if (filter.search) {
            query.andWhere('LOWER(users.username) LIKE LOWER(:search)', { search: `%${filter.search}%` });
        }

        if (filter.status) {
            query.andWhere('users.status = :status', { status: filter.status });
        }

        if (filter.role) {
            query.andWhere('users.role = :role', { role: filter.role });
        }

        const [users, usersCount] = await query
            .orderBy(`users.${filter.orderBy}`, filter.order)
            .skip(filter.skip)
            .take(filter.limit)
            .setFindOptions({ withDeleted: false })
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({ pageDto: filter.pageDto, total: usersCount });
        return new ResponsePageDto(
            users.filter((user) => user.username != 'scheduleAccount').map((e) => plainToInstance(UserData, e)),
            pageMetaDto,
        );
    }

    public async findByIdService(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id }, withDeleted: false });
    }

    public async validateExistUser(id: string): Promise<void> {
        if (!this.userRepository.findOne({ where: { id }, withDeleted: false })) {
            throw new NotFoundException('User not found');
        }
    }

    public async findByUsername(username: string): Promise<User | null> {
        let user = await this.userRepository.findOne({ where: { username: username }, withDeleted: false });

        if (!user) {
            return null;
        }
        return user;
    }

    public async findByEmail(email: string): Promise<User | null> {
        let user = await this.userRepository.findOne({ where: { email: email }, withDeleted: false });

        if (!user) {
            return null;
        }
        return user;
    }

    public async createInactiveWithUserNamePassword(value: { email: string; password: string }): Promise<UserData> {
        const user = await this.userRepository.exists({
            where: [{ username: value.email }, { email: value.email }],
            withDeleted: true,
        });
        if (user) {
            throw new BadRequestException('Duplicate username or email');
        }
        const passwordHash = await getPasswordHash(value.password);
        const newUser = plainToInstance(User, value);
        newUser.username = value.email;
        newUser.role = Role.USER;
        newUser.password = passwordHash;
        newUser.status = UserStatus.inactive;
        newUser.accessCount = 0;
        const newUserSave = this.userRepository.create(newUser);
        return plainToInstance(UserData, this.userRepository.save(newUserSave));
    }

    public async createService(value: UserInput, createdBy: string): Promise<UserData> {
        const userByEmail = await this.userRepository.exists({
            where: [{ email: value.email }],
            withDeleted: true,
        });
        if (userByEmail) {
            throw new BadRequestException('Duplicate email');
        }
        const userByUsername = await this.userRepository.exists({
            where: [{ username: value.username }],
            withDeleted: true,
        });
        if (userByUsername) {
            throw new BadRequestException('Duplicate username');
        }
        // No existing user, create new
        const passwordHash = await getPasswordHash(value.username + '-' + uuidv4());
        const newUser = plainToInstance(User, value);
        newUser.password = passwordHash;
        newUser.createdBy = createdBy;
        const newSavedUser = await this.userRepository
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(newUser)
            .execute();
        const savedUser = await this.userRepository.findOne({ where: { id: newSavedUser.identifiers[0].id } });
        return plainToInstance(UserData, savedUser);
    }

    public async updateService(id: string, value: Partial<UserUpdate>, updatedBy: string): Promise<UserData> {
        if (value.username || value.email) {
            const where: FindOptionsWhere<User>[] = [];
            if (value.username) {
                where.push({ username: value.username });
            }
            if (value.email) {
                where.push({ email: value.email });
            }
            const findUsers = await this.userRepository.find({ where });
            if (findUsers) {
                if (value.email && findUsers.find((user1) => user1.email == value.email && user1.id != id)) {
                    throw new BadRequestException('Duplicate email');
                }
                if (value.username && findUsers.find((user1) => user1.username == value.username && user1.id != id)) {
                    throw new BadRequestException('Duplicate username');
                }
            }
        }
        if (!this.userRepository.findOne({ where: { id }, withDeleted: false })) {
            throw new NotFoundException('Not found');
        }
        const user = plainToInstance(User, value);
        user.updatedBy = updatedBy;
        await this.userRepository.update(id, user);
        return plainToInstance(UserData, this.userRepository.findOne({ where: { id } }));
    }

    public async deleteService(id: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id }, withDeleted: false });
        if (!user) {
            throw new NotFoundException('Not found');
        }
        const randomUiid = uuidv4();
        await this.userRepository.update(id, {
            ...user,
            username: randomUiid,
            email: randomUiid + '@gmail.com',
            sub: randomUiid,
        });
        await this.userRepository.softDelete(id);
    }
}
