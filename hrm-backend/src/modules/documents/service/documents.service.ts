import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from '../model/document.entity';
import { UploadDocumentDto } from '../dto/document.dto';
import { PageDto } from '../../common/dto/page.dto';
import { ResponsePageDto } from '../../common/dto/response-page.dto';
import { PageMetaDto } from '../../common/dto/meta.dto';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document, 'appConnection')
        private readonly documentRepository: Repository<Document>,
    ) { }

    async findAllByUser(userId: string, pageDto: PageDto): Promise<ResponsePageDto<Document>> {
        const [data, total] = await this.documentRepository.findAndCount({
            where: { userId },
            order: { createdAt: pageDto.order },
            take: pageDto.limit,
            skip: pageDto.skip,
            withDeleted: false
        });

        return new ResponsePageDto(data, new PageMetaDto({ pageDto, total }));
    }

    async findById(id: string): Promise<Document> {
        const document = await this.documentRepository.findOne({
            where: { id },
            withDeleted: false
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        return document;
    }

    async createDocument(
        userId: string,
        uploadDto: UploadDocumentDto,
        filePath: string,
        fileSize: number,
        createdBy: string
    ): Promise<Document> {
        const latestVersion = await this.documentRepository
            .createQueryBuilder('doc')
            .where('doc.user_id = :userId', { userId })
            .andWhere('doc.name LIKE :name', { name: `%${uploadDto.name.split('_')[0]}%` })
            .orderBy('doc.version', 'DESC')
            .getOne();

        const version = latestVersion ? latestVersion.version + 1 : 1;

        const document = this.documentRepository.create({
            userId,
            name: uploadDto.name,
            type: uploadDto.type,
            status: DocumentStatus.UPLOADED,
            filePath,
            fileSize,
            version,
            description: uploadDto.description,
            createdBy,
        });

        return this.documentRepository.save(document);
    }

    async generateCV(userId: string, createdBy: string): Promise<Document> {
        // Stub for CV generation - would integrate with PDF generation service
        const cvName = `System_Generated_Resume_v${Date.now()}.pdf`;

        // In production, fetch actual profile version
        const profileVersion = 1; // Would come from UserProfile entity version tracking

        const document = this.documentRepository.create({
            userId,
            name: cvName,
            type: 'PDF' as any,
            status: DocumentStatus.AUTO_GENERATED,
            filePath: `/generated-cvs/${userId}/${cvName}`,
            fileSize: 0,
            version: 1,
            generatedFromProfileVersion: profileVersion,
            description: 'Auto-generated CV from profile data',
            createdBy,
        });

        return this.documentRepository.save(document);
    }

    async deleteDocument(id: string): Promise<void> {
        const document = await this.findById(id);
        await this.documentRepository.softDelete(id);
    }
}
