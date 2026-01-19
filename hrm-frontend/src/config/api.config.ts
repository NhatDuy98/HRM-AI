export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    IS_MOCK: import.meta.env.VITE_API_MODE === 'mock' || import.meta.env.VITE_API_MODE === undefined, // Default to mock if not set
    TIMEOUT: 10000,
};
