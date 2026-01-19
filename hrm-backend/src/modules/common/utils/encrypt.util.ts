import { createCipheriv, createDecipheriv } from 'crypto';

const key = Buffer.from('e2b8c7f9a1d4e5b6c8f9d0e2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1', 'hex');
const iv = Buffer.from('a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', 'hex');

export function encryptData(data: string): string {
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decryptData(encrypted: string): string {
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
