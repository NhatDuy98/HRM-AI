import { DataSource } from 'typeorm';
import { Achievement, AchievementType } from '../../modules/background/model/achievement.entity';
import { User } from '../../modules/user/model/user.entity';

export async function seedAchievements(dataSource: DataSource) {
    const achRepo = dataSource.getRepository(Achievement);
    const userRepo = dataSource.getRepository(User);

    const admin = await userRepo.findOneBy({ username: 'admin' });
    if (!admin) {
        console.log('Admin user not found, skipping Achievement seeding.');
        return;
    }

    const count = await achRepo.count({ where: { userId: admin.id } });
    if (count >= 11) {
        console.log('Skipping Achievement seeding: Main user has enough records.');
        return;
    }

    const achsToCreate = [];
    for (let i = 1; i <= 15; i++) {
        achsToCreate.push({
            userId: admin.id,
            title: `Achievement ${i}`,
            type: AchievementType.AWARD,
            date: new Date(),
            issuer: `Issuer ${i}`,
            createdBy: 'seed',
            updatedBy: 'seed',
            description: `Seeded achievement number ${i}`
        });
    }

    await achRepo.insert(achsToCreate);
    console.log('Achievement seeding completed.');
}
