import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const productService = {
    getAllProducts: async () => {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    },

    getProductById: async (id) => {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    },

    searchProducts: async (name) => {
        const response = await axios.get(`${API_URL}/products/search?name=${name}`);
        return response.data;
    },

    getProductsInStock: async () => {
        const response = await axios.get(`${API_URL}/products/in-stock`);
        return response.data;
    },

    createProduct: async (product) => {
        const response = await axios.post(`${API_URL}/products`, product);
        return response.data;
    },

    updateProduct: async (id, product) => {
        const response = await axios.put(`${API_URL}/products/${id}`, product);
        return response.data;
    },

    updateStock: async (id, quantity) => {
        const response = await axios.patch(`${API_URL}/products/${id}/stock?quantity=${quantity}`);
        return response.data;
    },

    deleteProduct: async (id) => {
        await axios.delete(`${API_URL}/products/${id}`);
    }
};
