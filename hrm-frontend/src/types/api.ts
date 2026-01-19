// Pagination & Meta
export interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface ListResponse<T> {
    data: T[];
    meta: Meta;
}

export interface ApiResponse<T = void> {
    data: T;
    message?: string;
}

// Error Standard
export interface ApiError {
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>; // Field validation errors
}
