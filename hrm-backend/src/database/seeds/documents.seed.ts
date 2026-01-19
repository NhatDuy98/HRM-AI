import { DataSource } from 'typeorm';
import { Document, DocumentType, DocumentStatus } from '../../modules/documents/model/document.entity';
import { User } from '../../modules/user/model/user.entity';

export async function seedDocuments(dataSource: DataSource) {
    const docRepo = dataSource.getRepository(Document);
    const userRepo = dataSource.getRepository(User);

    const admin = await userRepo.findOneBy({ username: 'admin' });
    if (!admin) {
        console.log('Admin user not found, skipping Document seeding.');
        return;
    }

    const count = await docRepo.count({ where: { userId: admin.id } });
    if (count >= 11) {
        console.log('Skipping Document seeding: Main user has enough records.');
        return;
    }

    const docsToCreate = [];
    for (let i = 1; i <= 15; i++) {
        docsToCreate.push({
            userId: admin.id,
            name: `Document_${i}.pdf`,
            type: DocumentType.PDF,
            status: DocumentStatus.UPLOADED,
            filePath: `/uploads/${admin.id}/document_${i}.pdf`,
            fileSize: 1024 * i,
            version: 1,
            createdBy: 'seed',
            updatedBy: 'seed',
            description: `Seeded document number ${i}`
        });
    }

    // Using repo.create() to validate entity structure then save
    // .insert is faster but bypasses some logic. Using create+save or just passed object to save.
    // Given the previous error with TypeORM strictness, .create({...}) ensures type safety if TS checks it.
    // But .insert accepts DeepPartial.
    // The previous error was property mismatch on .insert. 'created_by' vs 'createdBy'.
    // With corrected property names, docRepo.insert(docsToCreate) should work.

    await docRepo.insert(docsToCreate);
    console.log('Document seeding completed.');
}
