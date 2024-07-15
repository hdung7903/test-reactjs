import axios from 'axios';

const sessionToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhkdW5nIiwic3ViIjoiYTk3Y2Q1OTgtOGQxYy00NTk2LTg0ODItOGUyNDIxM2M1ZWM0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE5NTQ1MTE2LCJleHAiOjE3MjAxNDk5MTZ9.keUuL3102BKzkogBijw95hTXkQJpCKiCuEbjFq2tLOI";

const api = axios.create({
    baseURL: 'http://localhost:8000/user',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
    },
});

const userService = {

    getUserById: async (id: string) => {
        try {
            const response = await api.get(`info/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch user');
        }
    },

    updateAvatar: async (id: string, formData: FormData) => {
        try {
            const response = await api.put(`update-avatar/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Error in updateAvatar:', error.response?.data || error.message || error);
            throw new Error('Failed to update image');
        }
    }
}

export default userService;
