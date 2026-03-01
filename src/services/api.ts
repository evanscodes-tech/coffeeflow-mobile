import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
});

// Add token to requests if available
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions for farmers
export const farmerAPI = {
  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/farmer/dashboard/');
    return response.data;
  },

  // Get deliveries with pagination
  getDeliveries: async (page = 1, pageSize = 10) => {
    const response = await api.get(`/farmer/deliveries/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  // Get farmer profile
  getProfile: async () => {
    const response = await api.get('/farmer/profile/');
    return response.data;
  },
};

export default api;