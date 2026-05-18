import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add token to requests if available
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    console.log('🔑 Token exists:', token ? 'Yes' : 'No');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.log('⚠️ No token found');
    }
    return config;
  },
  (error) => {
    console.log('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ API Error:', error.response?.status, error.response?.config?.url);
    console.log('❌ Error details:', error.response?.data);
    
    // Handle 401 Unauthorized - clear token
    if (error.response?.status === 401) {
      console.log('🔴 Token expired or invalid, clearing storage');
      AsyncStorage.removeItem('authToken');
      AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

// OTP Authentication functions
export const authAPI = {
  requestOtp: async (phoneNumber: string) => {
    console.log('📱 Requesting OTP for:', phoneNumber);
    const response = await api.post('/auth/request-otp/', {
      phone_number: phoneNumber,
    });
    console.log('📱 OTP Response:', response.data);
    return response.data;
  },

  verifyOtp: async (phoneNumber: string, otpCode: string) => {
    console.log('🔐 Verifying OTP for:', phoneNumber);
    const response = await api.post('/auth/verify-otp/', {
      phone_number: phoneNumber,
      otp_code: otpCode,
    });
    console.log('🔐 Verify Response:', response.data);
    
    // Store token if successful
    if (response.data.success && response.data.token) {
      console.log('💾 Storing auth token');
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    console.log('🚪 Logging out');
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      try {
        await api.post('/auth/logout/');
      } catch (e) {
        console.log('Logout API error:', e);
      }
    }
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    console.log('✅ Cleaned up storage');
    return { success: true };
  },
};

// Farmer API functions
export const farmerAPI = {
  getDashboard: async () => {
    console.log('📊 Fetching dashboard');
    const response = await api.get('/farmer/dashboard/');
    console.log('📊 Dashboard data received');
    return response.data;
  },

  getDeliveries: async (page = 1, pageSize = 10) => {
    console.log('📦 Fetching deliveries, page:', page);
    const response = await api.get(`/farmer/deliveries/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  getProfile: async () => {
    console.log('👤 Fetching profile');
    const response = await api.get('/farmer/profile/');
    return response.data;
  },
};

export default api;