import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const orderService = {
    getAllOrders: async () => {
        const response = await axios.get(`${API_URL}/orders`);
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await axios.get(`${API_URL}/orders/${id}`);
        return response.data;
    },

    getOrdersByUserId: async (userId) => {
        const response = await axios.get(`${API_URL}/orders/user/${userId}`);
        return response.data;
    },

    getOrdersByStatus: async (status) => {
        const response = await axios.get(`${API_URL}/orders/status/${status}`);
        return response.data;
    },

    createOrder: async (order) => {
        const response = await axios.post(`${API_URL}/orders`, order);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await axios.patch(`${API_URL}/orders/${id}/status?status=${status}`);
        return response.data;
    },

    deleteOrder: async (id) => {
        await axios.delete(`${API_URL}/orders/${id}`);
    }
};
