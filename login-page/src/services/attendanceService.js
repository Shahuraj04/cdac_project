import api from './api';

const attendanceService = {
    getRecentAttendance: async () => {
        try {
            const response = await api.get('/attendance/recent');
            return response.data;
        } catch (error) {
            console.error('Error fetching recent attendance:', error);
            throw error.response?.data || { message: 'Failed to fetch recent attendance' };
        }
    },

    getAttendanceByEmployee: async (employeeId) => {
        try {
            const response = await api.get(`/attendance/employee/${employeeId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employee attendance:', error);
            throw error.response?.data || { message: 'Failed to fetch attendance' };
        }
    },

    markAttendance: async (attendanceData) => {
        try {
            const response = await api.post('/attendance', attendanceData);
            return response.data;
        } catch (error) {
            console.error('Error marking attendance:', error);
            throw error.response?.data || { message: 'Failed to mark attendance' };
        }
    },

    checkout: async (empId) => {
        try {
            const response = await api.post('/attendance/checkout', { empId });
            return response.data;
        } catch (error) {
            console.error('Error during checkout:', error);
            throw error.response?.data || { message: 'Failed to checkout' };
        }
    },

    getTodayStatus: async (empId) => {
        try {
            const response = await api.get(`/attendance/status/today/${empId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching today attendance status:', error);
            throw error.response?.data || { message: 'Failed to fetch today status' };
        }
    }
};

export default attendanceService;
