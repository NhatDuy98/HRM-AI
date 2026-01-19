import { DataSource } from 'typeorm';
import { Skill } from '../../modules/background/model/skill.entity';
import { User } from '../../modules/user/model/user.entity';

export async function seedSkills(dataSource: DataSource) {
    const skillRepo = dataSource.getRepository(Skill);
    const userRepo = dataSource.getRepository(User);

    const admin = await userRepo.findOneBy({ username: 'admin' });
    if (!admin) {
        console.log('Admin user not found, skipping Skill seeding.');
        return;
    }

    // Seed Skills
    const skillsList = [];
    for (let i = 1; i <= 15; i++) {
        skillsList.push(`Skill_${i}`);
    }

    const createdSkills: Skill[] = [];
    for (const name of skillsList) {
        let skill = await skillRepo.findOneBy({ name });
        if (!skill) {
            skill = await skillRepo.save(skillRepo.create({
                name,
                description: `Description for ${name}`,
                category: 'Technical',
                createdBy: 'seed',
                updatedBy: 'seed'
            }));
        }
        createdSkills.push(skill);
    }

    // Assign to Admin
    for (const skill of createdSkills) {
        const skillWithUsers = await skillRepo.findOne({
            where: { id: skill.id },
            relations: { users: true }
        });

        if (skillWithUsers) {
            const isAssigned = skillWithUsers.users.some(u => u.id === admin.id);
            if (!isAssigned) {
                skillWithUsers.users.push(admin);
                await skillRepo.save(skillWithUsers);
            }
        }
    }

    console.log('Skill seeding completed.');
}
