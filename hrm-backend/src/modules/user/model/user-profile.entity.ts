import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { User } from './user.entity';

@Entity({ name: 'user_profiles' })
export class UserProfile extends BaseEntity {
    @Column({ name: 'user_id' })
    public userId: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    public user: Relation<User>;

    @Column({ name: 'full_name', length: 255 })
    public fullName: string;

    @Column({ name: 'national_id', length: 50, nullable: true, unique: true })
    public nationalId: string;

    @Column({ name: 'date_of_birth', type: 'date', nullable: true })
    public dateOfBirth: Date;

    @Column({ name: 'gender', length: 20, nullable: true })
    public gender: string;

    @Column({ name: 'department', length: 255, nullable: true })
    public department: string;

    @Column({ name: 'position', length: 255, nullable: true })
    public position: string;

    @Column({ name: 'work_email', length: 255, nullable: true })
    public workEmail: string;

    @Column({ name: 'date_of_joining', type: 'date', nullable: true })
    public dateOfJoining: Date;

    @Column({ name: 'avatar_url', length: 500, nullable: true })
    public avatarUrl: string;

    @Column({ name: 'phone_number', length: 50, nullable: true })
    public phoneNumber: string;

    @Column({ name: 'address', length: 500, nullable: true })
    public address: string;
}
