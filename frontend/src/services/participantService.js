import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const getParticipantsByEvent = async (eventId) => {
    const response = await axios.get(`${API_URL}/participants/event/${eventId}`);
    return response.data;
};

export const getPendingParticipants = async (eventId) => {
    const response = await axios.get(`${API_URL}/participants/event/${eventId}/pending`);
    return response.data;
};

export const getCheckedInParticipants = async (eventId) => {
    const response = await axios.get(`${API_URL}/participants/event/${eventId}/checked-in`);
    return response.data;
};

export const getWalkIns = async (eventId) => {
    const response = await axios.get(`${API_URL}/participants/event/${eventId}/walk-ins`);
    return response.data;
};

export const getEventStats = async (eventId) => {
    const response = await axios.get(`${API_URL}/participants/event/${eventId}/stats`);
    return response.data;
};

export const createParticipant = async (eventId, participant) => {
    const response = await axios.post(`${API_URL}/participants/event/${eventId}`, participant);
    return response.data;
};

export const createWalkIn = async (eventId, participant) => {
    const response = await axios.post(`${API_URL}/participants/event/${eventId}/walk-in`, participant);
    return response.data;
};

export const checkIn = async (id) => {
    const response = await axios.patch(`${API_URL}/participants/${id}/checkin`);
    return response.data;
};

export const updateParticipant = async (id, participant) => {
    const response = await axios.put(`${API_URL}/participants/${id}`, participant);
    return response.data;
};

export const deleteParticipant = async (id) => {
    await axios.delete(`${API_URL}/participants/${id}`);
};
