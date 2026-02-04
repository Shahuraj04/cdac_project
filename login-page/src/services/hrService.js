import api from './api';

const hrService = {
    getAllHr: async () => {
        try {
            const response = await api.get('/Hr/allHr');
            return response.data;
        } catch (error) {
            console.error('Error fetching all HRs:', error);
            throw error.response?.data || { message: 'Failed to fetch HRs' };
        }
    },

    getHrById: async (hrId) => {
        try {
            const response = await api.get(`/Hr/getHrById/${hrId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching HR with ID ${hrId}:`, error);
            throw error.response?.data || { message: 'Failed to fetch HR' };
        }
    },

    getHrByEmail: async (email) => {
        try {
            const response = await api.get(`/Hr/email/${email}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching HR for email ${email}:`, error);
            throw error.response?.data || { message: 'Failed to fetch HR profile' };
        }
    },

    getHrByUserId: async (userId) => {
        try {
            const response = await api.get(`/Hr/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching HR for user ${userId}:`, error);
            throw error.response?.data || { message: 'Failed to fetch HR profile' };
        }
    },

    updateHr: async (hrId, hrData) => {
        try {
            const response = await api.put(`/Hr/${hrId}`, hrData);
            return response.data;
        } catch (error) {
            console.error('Error updating HR:', error);
            throw error.response?.data || { message: 'Failed to update HR' };
        }
    }
};

export default hrService;
