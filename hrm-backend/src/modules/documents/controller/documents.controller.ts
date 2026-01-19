import { Controller, Get, Post, Body, Param, Delete, Res, UseInterceptors, UploadedFile, HttpStatus, Put, UseGuards, Request } from '@nestjs/common';
import { ApiConsumes, ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common';
import { Response } from 'express';
import { DocumentsService } from '../service/documents.service';
import { UploadDocumentDto } from '../dto/document.dto';
import { PageDto } from '../../common/dto/page.dto';
import { Query, ValidationPipe } from '@nestjs/common';

@ApiTags('Documents')
@Controller('documents')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all documents for current user' })
    async getDocuments(
        @Request() req: any,
        @Query(new ValidationPipe({ transform: true })) pageDto: PageDto
    ) {
        const userId = req.user?.id || 'test-user-id';
        return this.documentsService.findAllByUser(userId, pageDto);
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload a new document' })
    @ApiConsumes('multipart/form-data')
    async uploadDocument(
        @Request() req: any,
        @Body() uploadDto: UploadDocumentDto
    ) {
        const userId = req.user?.id || 'test-user-id';
        const createdBy = req.user?.id || 'SYSTEM';

        // In production, implement file upload with multer or similar
        // For now, stub the file path and size
        const filePath = `/uploads/${userId}/${uploadDto.name}`;
        const fileSize = 0; // Would come from uploaded file

        return this.documentsService.createDocument(
            userId,
            uploadDto,
            filePath,
            fileSize,
            createdBy
        );
    }

    @Post('generate-cv')
    @ApiOperation({ summary: 'Auto-generate CV from profile data' })
    async generateCV(@Request() req: any) {
        const userId = req.user?.id || 'test-user-id';
        const createdBy = req.user?.id || 'SYSTEM';
        return this.documentsService.generateCV(userId, createdBy);
    }

    @Get(':id/download')
    @ApiOperation({ summary: 'Download a document' })
    async downloadDocument(
        @Param('id') id: string,
        @Res({ passthrough: true }) res: Response
    ) {
        const document = await this.documentsService.findById(id);

        // In production, retrieve from actual storage
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${document.name}"`,
        });

        // Stub - would return actual file stream
        return { message: 'File download endpoint', documentId: id };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a document' })
    async deleteDocument(@Param('id') id: string) {
        await this.documentsService.deleteDocument(id);
        return { message: 'Document deleted successfully' };
    }
}
