import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { User } from '../../user/model/user.entity';

@Entity({ name: 'skills' })
export class Skill extends BaseEntity {
    @Column({ name: 'name', length: 255, unique: true })
    public name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    public description: string;

    @Column({ name: 'category', length: 100, nullable: true })
    public category: string;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'user_skills',
        joinColumn: { name: 'skill_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
    })
    users: User[];
}
