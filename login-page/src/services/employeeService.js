import api from './api';

const employeeService = {
    getEmployeeCount: async () => {
        try {
            const response = await api.get('/employee/count');
            return response.data;
        } catch (error) {
            console.error('Error fetching employee count:', error);
            throw error.response?.data || { message: 'Failed to fetch employee count' };
        }
    },

    getAllEmployees: async () => {
        try {
            const response = await api.get('/employee/allEmployees');
            return response.data;
        } catch (error) {
            console.error('Error fetching all employees:', error);
            throw error.response?.data || { message: 'Failed to fetch employees' };
        }
    },

    getEmployeeByUserId: async (userId) => {
        try {
            // Note: This endpoint might need to be exposed explicitly if not already
            const response = await api.get(`/employee/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching employee for user ${userId}:`, error);
            throw error.response?.data || { message: 'Failed to fetch employee profile' };
        }
    },

    getEmployeeByEmail: async (email) => {
        try {
            const response = await api.get(`/employee/email/${email}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching employee for email ${email}:`, error);
            throw error.response?.data || { message: 'Failed to fetch employee profile' };
        }
    },

    updateEmployee: async (empId, empData) => {
        try {
            const response = await api.put(`/employee/${empId}`, empData);
            return response.data;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error.response?.data || { message: 'Failed to update employee profile' };
        }
    },
    addEmployee: async (empData) => {
        try {
            const response = await api.post('/employee/addemployee', empData);
            return response.data;
        } catch (error) {
            console.error('Error adding employee:', error);
            throw error.response?.data || { message: 'Failed to add employee' };
        }
    },

    getEmployeeById: async (empId) => {
        try {
            const response = await api.get(`/employee/id/${empId}`);
            const list = Array.isArray(response.data) ? response.data : [response.data];
            return list.length ? list[0] : null;
        } catch (error) {
            console.error('Error fetching employee by id:', error);
            throw error.response?.data || { message: 'Failed to fetch employee' };
        }
    },

    deleteEmployee: async (empId) => {
        try {
            await api.delete(`/employee/delete/${empId}`);
            return { success: true };
        } catch (error) {
            console.error('Error deactivating employee:', error);
            throw error.response?.data || { message: 'Failed to deactivate employee' };
        }
    },

    reactivateEmployee: async (empId) => {
        try {
            const response = await api.put(`/employee/${empId}/reactivate`);
            return response.data;
        } catch (error) {
            console.error('Error reactivating employee:', error);
            throw error.response?.data || { message: 'Failed to reactivate employee' };
        }
    },

    getPerformance: async (empId, months = 6) => {
        try {
            const response = await api.get(`/employee/${empId}/performance`, { params: { months } });
            return response.data || [];
        } catch (error) {
            console.error('Error fetching performance:', error);
            return [];
        }
    }
};

export default employeeService;
