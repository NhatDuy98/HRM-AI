import { Column, Entity, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { User } from '../../user/model/user.entity';

export enum AchievementType {
    AWARD = 'AWARD',
    CERTIFICATION = 'CERTIFICATION',
    INCIDENT = 'INCIDENT'
}

@Entity({ name: 'achievements' })
export class Achievement extends BaseEntity {
    @Column({ name: 'user_id' })
    public userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    public user: Relation<User>;

    @Column({ name: 'title', length: 255 })
    public title: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    public description: string;

    @Column({ name: 'date', type: 'date', nullable: true })
    public date: Date;

    @Column({ name: 'type', type: 'varchar', length: 30 })
    public type: AchievementType;

    @Column({ name: 'issuer', length: 255, nullable: true })
    public issuer: string;
}
