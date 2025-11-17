import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const paymentService = {
    getAllPayments: async () => {
        const response = await axios.get(`${API_URL}/payments`);
        return response.data;
    },

    getPaymentById: async (id) => {
        const response = await axios.get(`${API_URL}/payments/${id}`);
        return response.data;
    },

    getPaymentByOrderId: async (orderId) => {
        const response = await axios.get(`${API_URL}/payments/order/${orderId}`);
        return response.data;
    },

    getPaymentsByStatus: async (status) => {
        const response = await axios.get(`${API_URL}/payments/status/${status}`);
        return response.data;
    },

    createPayment: async (payment) => {
        const response = await axios.post(`${API_URL}/payments`, payment);
        return response.data;
    },

    processPayment: async (id) => {
        const response = await axios.patch(`${API_URL}/payments/${id}/process`);
        return response.data;
    },

    completePayment: async (id) => {
        const response = await axios.patch(`${API_URL}/payments/${id}/complete`);
        return response.data;
    },

    failPayment: async (id) => {
        const response = await axios.patch(`${API_URL}/payments/${id}/fail`);
        return response.data;
    },

    deletePayment: async (id) => {
        await axios.delete(`${API_URL}/payments/${id}`);
    }
};
