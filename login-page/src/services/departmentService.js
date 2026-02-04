import api from './api';

const departmentService = {
    getAll: async () => {
        try {
            const response = await api.get('/department/allDepartments');
            return response.data;
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error.response?.data || { message: 'Failed to fetch departments' };
        }
    },

    getById: async (deptId) => {
        try {
            const response = await api.get(`/department/id/${deptId}`);
            const list = Array.isArray(response.data) ? response.data : [response.data];
            return list.length ? list[0] : null;
        } catch (error) {
            console.error('Error fetching department:', error);
            throw error.response?.data || { message: 'Failed to fetch department' };
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/department', data);
            return response.data;
        } catch (error) {
            console.error('Error creating department:', error);
            throw error.response?.data || { message: 'Failed to create department' };
        }
    },

    update: async (deptId, data) => {
        try {
            const response = await api.put(`/department/${deptId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating department:', error);
            throw error.response?.data || { message: 'Failed to update department' };
        }
    },

    delete: async (deptId) => {
        try {
            await api.delete(`/department/delete/${deptId}`);
            return { success: true };
        } catch (error) {
            console.error('Error deleting department:', error);
            throw error.response?.data || { message: 'Failed to delete department' };
        }
    }
};

export default departmentService;
