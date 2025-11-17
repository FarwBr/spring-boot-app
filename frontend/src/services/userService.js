import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const userService = {
    getAllUsers: async () => {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    },

    getUserById: async (id) => {
        const response = await axios.get(`${API_URL}/users/${id}`);
        return response.data;
    },

    createUser: async (user) => {
        const response = await axios.post(`${API_URL}/users`, user);
        return response.data;
    },

    updateUser: async (id, user) => {
        const response = await axios.put(`${API_URL}/users/${id}`, user);
        return response.data;
    },

    deleteUser: async (id) => {
        await axios.delete(`${API_URL}/users/${id}`);
    }
};
