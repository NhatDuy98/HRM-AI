import { Column, Entity, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { User } from '../../user/model/user.entity';

export enum DocumentType {
    PDF = 'PDF',
    DOCX = 'DOCX',
    DOC = 'DOC'
}

export enum DocumentStatus {
    UPLOADED = 'UPLOADED',
    AUTO_GENERATED = 'AUTO_GENERATED',
    DRAFT = 'DRAFT'
}

@Entity({ name: 'documents' })
export class Document extends BaseEntity {
    @Column({ name: 'user_id' })
    public userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    public user: Relation<User>;

    @Column({ name: 'name', length: 255 })
    public name: string;

    @Column({ name: 'type', type: 'varchar', length: 20 })
    public type: DocumentType;

    @Column({ name: 'status', type: 'varchar', length: 30 })
    public status: DocumentStatus;

    @Column({ name: 'file_path', length: 500 })
    public filePath: string;

    @Column({ name: 'file_size', type: 'int', nullable: true })
    public fileSize: number;

    @Column({ name: 'version', type: 'int', default: 1 })
    public version: number;

    @Column({ name: 'generated_from_profile_version', type: 'int', nullable: true })
    public generatedFromProfileVersion?: number;

    @Column({ name: 'description', type: 'text', nullable: true })
    public description: string;
}
