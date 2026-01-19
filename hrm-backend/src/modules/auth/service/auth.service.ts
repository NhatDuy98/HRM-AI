import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as jwt from 'jsonwebtoken';
import ldap from 'ldapjs';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from '../../common';
import { UserStatus, verifyPassword } from '../../common/utils';
import { User, UserData, UserPayload } from '../../user/model';
import { UserService } from '../../user/service';
import { AuthLogin, LoginDto } from '../model';

@Injectable()
export class AuthService {
    public constructor(
        private readonly userService: UserService,
        @InjectRepository(User, 'appConnection')
        private readonly userRepo: Repository<User>,
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
    ) { }

    public async login(authLogin: AuthLogin): Promise<LoginDto> {
        const user = await this.userService.findByUsername(authLogin.username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await verifyPassword(authLogin.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.status !== UserStatus.active) {
            throw new UnauthorizedException('User account is inactive');
        }

        // Update user login status
        user.isLogin = true;
        user.lastLogin = new Date();
        user.accessCount = (user.accessCount || 0) + 1;

        // Generate tokens
        const accessToken = await this.generateAccessToken(plainToInstance(UserData, user));
        const refreshToken = await this.generateRefreshToken(plainToInstance(UserData, user));

        user.token = refreshToken;
        await this.userRepo.save(user);

        return new LoginDto(plainToInstance(UserData, user), accessToken);
    }

    public async refreshToken(user: UserPayload): Promise<LoginDto> {
        try {
            const userExists = await this.userRepo.findOne({ where: { id: user.id }, withDeleted: false });

            if (!userExists) {
                throw new NotFoundException('User not found');
            }
            const env = process.env;
            const payload = jwt.verify(userExists.token, `${env.JWT_SECRET}`, {
                algorithms: ['HS256'],
            });

            if (typeof payload === 'string') {
                throw new UnauthorizedException('Not allow');
            }
            const response = plainToInstance(UserData, userExists);

            return new LoginDto(response, await this.generateAccessToken(response));
        } catch (err) {
            throw new UnauthorizedException('Not allow');
        }
    }

    public async logoutService(user: UserPayload): Promise<void> {
        await this.userRepo.update(user.id, { isLogin: false });
    }

    public async generateAccessToken(user: UserData): Promise<string> {
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role, // Added role to payload
        };
        const secret = this.configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error('JWT SECRET not defined');
        }

        const options: jwt.SignOptions = {
            algorithm: 'HS256',
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
        };

        const token = jwt.sign(payload, secret, options);

        return token;
    }

    public async generateRefreshToken(user: UserData): Promise<string> {
        const payload = {
            id: user.id,
            username: user.username,
        };
        const secret = this.configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error('JWT SECRET not defined');
        }

        const options: jwt.SignOptions = {
            algorithm: 'HS256',
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
        };

        const token = jwt.sign(payload, secret, options);

        return token;
    }

    private async ldapAuthenticate(username: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const client = ldap.createClient({
                url: process.env.LDAP_URL || '',
            });
            client.on('error', (err) => {
                this.logger.info(`LDAP connection error ${err}`);
            });
            client.bind(username, password, (err) => {
                if (err) {
                    this.logger.info(`LDAP login error ${err}`);
                } else {
                    this.logger.info(`LDAP login success`);
                }
                resolve(!err);
            });
        });
    }

    public async loginWithOidc(email: string): Promise<LoginDto> {
        let user = await this.userService.findByEmail(email);
        if (!user) {
            const createdUser = await this.userService.createInactiveWithUserNamePassword({
                email: email,
                password: email + '-' + uuidv4(),
            });
            user = plainToInstance(User, createdUser);
        }
        if (user.status != UserStatus.active) {
            throw new Error('Please contact admin to active your account');
        }
        if (!user.token) {
            const refreshToken = await this.generateRefreshToken(plainToInstance(UserData, user));
            user.token = refreshToken;
        }
        user.isLogin = true;
        user.accessCount = user.accessCount + 1;
        user.lastLogin = new Date();
        const response = plainToInstance(UserData, user);
        await this.userRepo.update(user.id, user);
        return new LoginDto(response, await this.generateAccessToken(response));
    }

    public async getAccessToken(): Promise<string> {
        const user = await this.userRepo.findOne({ where: { username: 'scheduleAccount' }, withDeleted: false });
        const response = plainToInstance(UserData, user);
        return this.generateAccessToken(response);
    }
}
