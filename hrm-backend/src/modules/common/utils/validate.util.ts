export const validateDataField = (data: any): any | null => {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        const keys = Object.keys(data);
        if (keys.length === 0) {
            return null;
        }
    }
    return data;
}