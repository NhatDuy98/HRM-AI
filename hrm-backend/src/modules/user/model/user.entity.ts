import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @Column({ name: 'username', length: 50 })
    public username: string;

    @Column({ name: 'password', length: 255 })
    @Exclude()
    public password: string;

    @Column({ name: 'is_login', default: false })
    public isLogin: boolean;

    @Column({ name: 'role', length: 20 })
    public role: string;

    @Column({ name: 'token', length: 255, nullable: true })
    @Exclude()
    public token: string;

    @Column({ name: 'company', nullable: true })
    public company: string;

    @Column({ name: 'department', nullable: true })
    public department: string;

    @Column({ name: 'status', default: 'active' })
    public status: string;

    @Column({ name: 'last_login', type: 'timestamp', nullable: true })
    public lastLogin: Date;

    @Column({ name: 'access_count', default: 0 })
    public accessCount: number;

    @Column({ name: 'observation_area', length: 1000, nullable: true })
    public observationArea: string;

    @Column({ name: 'email', nullable: true })
    public email: string;

    @Column({ name: 'name', nullable: true })
    public name: string;

    @Column({ name: 'position', nullable: true })
    public position: string;

    @Column({ name: 'sub', nullable: true })
    public sub: string;
}

