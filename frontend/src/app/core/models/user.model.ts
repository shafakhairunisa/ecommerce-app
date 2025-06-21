export interface User {
    userId?: number;
    username: string;
    email: string;
    password?: string;
    role?: string;
    gender?: string;
    bio?: string;
    address?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    createdAt?: Date;
    updatedAt?: Date;
    enabled?: boolean;
}

export interface AuthResponse {
    token: string;
    message?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role: string;
} 