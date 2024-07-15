import axios from 'axios';
import { CreateUserDto, User } from '../types/auth';
import Cookies from 'js-cookie';

const sessionToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMDY3MTkxNCwiZXhwIjoxNzIxMjc2NzE0fQ.SLBmmAW_gKK4-qKgqBRg63EtsCrcU9HcuA5c8QhLic0";

const api = axios.create({
    baseURL: 'http://localhost:8000/admin',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
    },
});

const adminService = {

    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch users');
        }
    },

    addUsers: async (users: CreateUserDto[]) => {
        const response = await api.post('/add', users);
        return response.data;
    },

    addUsersFile: async (formData: FormData) => {
        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to add users from file');
        }
    },

    downloadUsersData: async () => {
        try {
            const response = await api.get('/users/download',{ responseType: 'arraybuffer' });
            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to download users data');
        }
    },
}


export default adminService;