import axios from 'axios';
import { LoginDto, LoginResponse } from '../types/auth';

const api = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

const authService = {
    login: async (loginDto: LoginDto): Promise<LoginResponse> => {
        try {
            const response = await api.post<LoginResponse>('/auth/login', loginDto);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Login failed');
        }
    },

    register: async (email: string, password: string) => {
        try {
            const response = await api.post('/register', { email, password });
            return response.data;
        } catch (error) {
            throw new Error('Registration failed');
        }
    },

    // forgotPassword: async (email: string) => {
    //     try {
    //         const response = await api.post('/forgot-password', { email });
    //         return response.data;
    //     } catch (error) {
    //         throw new Error('Forgot password failed');
    //     }
    // },

    // resetPassword: async (email: string, newPassword: string, resetToken: string) => {
    //     try {
    //         const response = await api.post('/reset-password', { email, newPassword, resetToken });
    //         return response.data;
    //     } catch (error) {
    //         throw new Error('Reset password failed');
    //     }
    // },
};

export default authService;