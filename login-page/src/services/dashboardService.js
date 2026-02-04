import api from './api';

const dashboardService = {
    getDashboardData: async () => {
        try {
            const response = await api.get('/api/dashboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error.response?.data || { message: 'Failed to fetch dashboard data' };
        }
    }
};

export default dashboardService;
