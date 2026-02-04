import api from './api';

const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/api/auth/signin', { email, password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error.response?.data || { message: 'Connection to server failed' };
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/api/auth/signup', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;
