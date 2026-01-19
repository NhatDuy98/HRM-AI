import { DataSource } from 'typeorm';
import { Education } from '../../modules/background/model/education.entity';
import { User } from '../../modules/user/model/user.entity';

export async function seedEducation(dataSource: DataSource) {
    const eduRepo = dataSource.getRepository(Education);
    const userRepo = dataSource.getRepository(User);

    const admin = await userRepo.findOneBy({ username: 'admin' });
    if (!admin) {
        console.log('Admin user not found, skipping Education seeding.');
        return;
    }

    const count = await eduRepo.count({ where: { userId: admin.id } });
    if (count >= 11) {
        console.log('Skipping Education seeding: Main user has enough records.');
        return;
    }

    const edusToCreate = [];
    for (let i = 1; i <= 15; i++) {
        edusToCreate.push({
            userId: admin.id,
            degree: `Bachelor of Science ${i}`,
            institution: `University ${i}`,
            startYear: 2010 + i,
            endYear: 2014 + i,
            fieldOfStudy: 'Computer Science',
            createdBy: 'seed',
            updatedBy: 'seed',
            description: `Seeded education record ${i}`
        });
    }

    await eduRepo.insert(edusToCreate);
    console.log('Education seeding completed.');
}
