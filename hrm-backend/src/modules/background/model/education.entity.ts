import { Column, Entity, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { User } from '../../user/model/user.entity';

@Entity({ name: 'educations' })
export class Education extends BaseEntity {
    @Column({ name: 'user_id' })
    public userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    public user: Relation<User>;

    @Column({ name: 'degree', length: 255 })
    public degree: string;

    @Column({ name: 'institution', length: 255 })
    public institution: string;

    @Column({ name: 'start_year', type: 'int', nullable: true })
    public startYear: number;

    @Column({ name: 'end_year', type: 'int', nullable: true })
    public endYear: number;

    @Column({ name: 'description', type: 'text', nullable: true })
    public description: string;

    @Column({ name: 'field_of_study', length: 255, nullable: true })
    public fieldOfStudy: string;
}
