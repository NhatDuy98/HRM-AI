import { DataSource } from 'typeorm';
import { User } from '../../modules/user/model/user.entity';
import { getPasswordHash } from '../../modules/common/utils/security.util';

export async function seedUsers(dataSource: DataSource) {
    const repo = dataSource.getRepository(User);
    const count = await repo.count();
    if (count >= 11) {
        console.log('Skipping User seeding: Already has enough records.');
        return;
    }

    const passwordHash = await getPasswordHash('password123');

    // Primary User
    const primaryUser = repo.create({
        username: 'admin',
        password: passwordHash,
        isLogin: false,
        role: 'ADMIN',
        status: 'active',
        accessCount: 0,
        email: 'admin@example.com',
        createdBy: 'seed',
        updatedBy: 'seed'
    });

    const adminExists = await repo.findOneBy({ username: 'admin' });
    if (!adminExists) {
        await repo.save(primaryUser);
    }

    // Secondary Users
    const usersToCreate = [];
    for (let i = 1; i <= 10; i++) {
        usersToCreate.push({
            username: `user${i}`,
            password: passwordHash,
            isLogin: false,
            role: 'USER',
            status: 'active',
            accessCount: 0,
            email: `user${i}@example.com`,
            createdBy: 'seed',
            updatedBy: 'seed'
        });
    }

    for (const u of usersToCreate) {
        const exists = await repo.findOneBy({ username: u.username });
        if (!exists) {
            await repo.save(repo.create(u));
        }
    }

    console.log('User seeding completed.');
}
