import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'SYSTIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'SYSTIMESTAMP' })
    public updatedAt: Date;

    @Column({ name: 'created_by', nullable: true, default: null })
    public createdBy: string;

    @Column({ name: 'updated_by', nullable: true, default: null })
    public updatedBy: string;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true, default: null })
    @Exclude()
    public deletedAt: Date;
}
