import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const notificationService = {
    getAllNotifications: async () => {
        const response = await axios.get(`${API_URL}/notifications`);
        return response.data;
    },

    getNotificationById: async (id) => {
        const response = await axios.get(`${API_URL}/notifications/${id}`);
        return response.data;
    },

    getNotificationsByUserId: async (userId) => {
        const response = await axios.get(`${API_URL}/notifications/user/${userId}`);
        return response.data;
    },

    getUnreadNotifications: async (userId) => {
        const response = await axios.get(`${API_URL}/notifications/user/${userId}/unread`);
        return response.data;
    },

    createNotification: async (notification) => {
        const response = await axios.post(`${API_URL}/notifications`, notification);
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await axios.patch(`${API_URL}/notifications/${id}/read`);
        return response.data;
    },

    markAllAsReadForUser: async (userId) => {
        await axios.patch(`${API_URL}/notifications/user/${userId}/read-all`);
    },

    deleteNotification: async (id) => {
        await axios.delete(`${API_URL}/notifications/${id}`);
    }
};
