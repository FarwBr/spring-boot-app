import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const getAllEvents = async () => {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
};

export const getEventById = async (id) => {
    const response = await axios.get(`${API_URL}/events/${id}`);
    return response.data;
};

export const getActiveEvents = async () => {
    const response = await axios.get(`${API_URL}/events/active`);
    return response.data;
};

export const getCurrentEvents = async () => {
    const response = await axios.get(`${API_URL}/events/current`);
    return response.data;
};

export const createEvent = async (event) => {
    const response = await axios.post(`${API_URL}/events`, event);
    return response.data;
};

export const updateEvent = async (id, event) => {
    const response = await axios.put(`${API_URL}/events/${id}`, event);
    return response.data;
};

export const toggleEventStatus = async (id) => {
    const response = await axios.patch(`${API_URL}/events/${id}/toggle-active`);
    return response.data;
};

export const deleteEvent = async (id) => {
    await axios.delete(`${API_URL}/events/${id}`);
};
