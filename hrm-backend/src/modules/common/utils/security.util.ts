import * as bcrypt from 'bcrypt';

const saltOrRounds: number = 10;

export const getPasswordHash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltOrRounds);
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}