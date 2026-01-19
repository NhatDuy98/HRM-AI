import { DataSource } from 'typeorm';
import { UserProfile } from '../../modules/user/model/user-profile.entity';
import { User } from '../../modules/user/model/user.entity';

export async function seedUserProfiles(dataSource: DataSource) {
    const userRepo = dataSource.getRepository(User);
    const profileRepo = dataSource.getRepository(UserProfile);

    const count = await profileRepo.count();
    if (count >= 11) {
        console.log('Skipping UserProfile seeding: Already has enough records.');
        return;
    }

    const users = await userRepo.find();

    for (const user of users) {
        const profileExists = await profileRepo.findOneBy({ userId: user.id });
        if (profileExists) continue;

        await profileRepo.save(profileRepo.create({
            userId: user.id,
            fullName: user.username === 'admin' ? 'Administrator' : `User ${user.username}`,
            workEmail: user.email,
            position: user.role === 'ADMIN' ? 'Manager' : 'Employee',
            createdBy: 'seed',
            updatedBy: 'seed',
            dateOfJoining: new Date(),
            phoneNumber: '1234567890'
        }));
    }

    console.log('UserProfile seeding completed.');
}
