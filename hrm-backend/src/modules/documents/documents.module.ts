import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './model/document.entity';
import { DocumentsService } from './service/documents.service';
import { DocumentsController } from './controller/documents.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Document], 'appConnection'),
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
    exports: [DocumentsService],
})
export class DocumentsModule { }
