import { DataSource } from 'typeorm';
import appDataSource from '../typeOrm.config';
import { seedUsers, seedUserProfiles, seedDocuments, seedEducation, seedSkills, seedAchievements } from './seeds';

async function runSeed() {
    let dataSource: DataSource | null = null;
    try {
        console.log('Initializing DataSource...');
        dataSource = await appDataSource.initialize();
        console.log('DataSource initialized.');

        console.log('Running Seeds...');

        await seedUsers(dataSource);
        await seedUserProfiles(dataSource);
        await seedDocuments(dataSource);
        await seedEducation(dataSource);
        await seedSkills(dataSource);
        await seedAchievements(dataSource);

        console.log('All seeds verified successfully!');
    } catch (error) {
        console.error('Error running seeds:', error);
        process.exit(1);
    } finally {
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('DataSource destroyed.');
        }
    }
}

runSeed();
