import api from './api';

const leaveService = {

    getLeaveCount: async () => {
        try {
            const response = await api.get('/leaves/pendingcount');
            return response.data;
        } catch (error) {
            console.error('Error fetching leave count:', error);
            throw error.response?.data || { message: 'Failed to fetch leave count' };
        }
    },


    getLeavesByStatus: async (status) => {
        try {
            const response = await api.get(`/leaves/approvedcount`, {
                params: { status }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${status} leaves:`, error);
            throw error.response?.data || { message: 'Failed to fetch leaves' };
        }
    },

    getDetailedLeaves: async (deptId = null) => {
        try {
            const endpoint = deptId ? `/leaves/department` : `/leaves/status?status=PENDING`;
            const response = await api.get(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error fetching detailed leaves:', error);
            throw error.response?.data || { message: 'Failed to fetch detailed leaves' };
        }
    },

    getLeavesByEmployee: async (empId) => {
        try {
            const response = await api.get(`/leaves/employee/${empId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employee leave history:', error);
            throw error.response?.data || { message: 'Failed to fetch leave history' };
        }
    },

    updateLeaveStatus: async (leaveId, status, hrId) => {
        try {
            const response = await api.put(`/leaves/${leaveId}/status`, null, {
                params: { status, hrId }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating leave status:', error);
            throw error.response?.data || { message: 'Failed to update leave status' };
        }
    },

    applyLeave: async (leaveData) => {
        try {
            const response = await api.post('/leaves', leaveData);
            return response.data;
        } catch (error) {
            console.error('Error applying for leave:', error);
            throw error.response?.data || { message: 'Failed to apply for leave' };
        }
    },

    getEmployeeLeaveHistory: async (empId) => {
        try {
            const response = await api.get(`/leaves/employee/${empId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employee leave history:', error);
            throw error.response?.data || { message: 'Failed to fetch leave history' };
        }
    },

    getLeaveCategories: async () => {
        try {
            const response = await api.get('/leaves/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching leave categories:', error);
            throw error.response?.data || { message: 'Failed to fetch leave categories' };
        }
    }

};

export default leaveService;
