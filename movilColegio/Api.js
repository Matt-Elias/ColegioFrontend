import axios from 'axios';
import {API_BASE_URL} from '@env';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getData = async(endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error en GET:', error.response?.data || error.message);
        throw error; 
    }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error en POST:', error.response?.data || error.message);
    throw error;
  }
};

export default api;

