export enum Role {
    ADMIN = 'admin',
    ACADEMIC = 'academic',
    INSTRUCTOR = 'instructor',
    STUDENT = 'student',
}

export interface LoginDto {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    role: Role;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    imageUrl:string,
}

export interface LoginResponse {
    accessToken: string;
    user: User;
    message: string;
}

export interface CurrentUser{
    id: string;
    username: string;
    email: string;
    role: string;
    imageUrl?:string,
    accessToken: string;
}
