import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

interface User {
  id: number;
  name: string;
  phone_number: string;
  farm_name: string;
  role: string;
}

interface DashboardData {
  farmer: User;
  stats: {
    total_deliveries: number;
    total_kgs: number;
    this_year_kgs: number;
    pending_payments: number;
    paid_payments: number;
  };
  recent_deliveries: any[];
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  dashboardData: DashboardData | null;
  requestOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (phoneNumber: string, otpCode: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadDashboard: () => Promise<DashboardData | null>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      console.log('🔍 loadStoredData - Token exists:', !!token);
      console.log('🔍 loadStoredData - UserData exists:', !!userData);
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        console.log('✅ User restored from storage');
        // Load dashboard after confirming auth
        await loadDashboard();
      } else {
        console.log('⚠️ No stored auth data found');
      }
    } catch (error) {
      console.error('Failed to load auth data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (phoneNumber: string): Promise<boolean> => {
    console.log('📱 requestOtp called for:', phoneNumber);
    try {
      const response = await fetch(`${API_URL}/api/auth/request-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });
      
      const data = await response.json();
      console.log('📱 OTP request response:', data);
      return data.success === true;
    } catch (error) {
      console.error('OTP request error:', error);
      return false;
    }
  };

  const verifyOtp = async (phoneNumber: string, otpCode: string): Promise<boolean> => {
    console.log('🔐 verifyOtp called for:', phoneNumber, 'Code:', otpCode);
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone_number: phoneNumber, 
          otp_code: otpCode 
        }),
      });
      
      const data = await response.json();
      console.log('🔐 Verify OTP response:', data);
      
      if (data.success && data.token) {
        console.log('💾 Storing token and user data');
        // Store token and user data
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        
        console.log('📊 Loading dashboard after successful login');
        // Load dashboard after successful login
        await loadDashboard();
        return true;
      }
      console.log('❌ OTP verification failed:', data.error);
      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const loadDashboard = async (): Promise<DashboardData | null> => {
    console.log('📊 loadDashboard called');
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('📊 Token exists for dashboard:', !!token);
      
      if (!token) {
        console.log('❌ No token found, cannot load dashboard');
        return null;
      }
      
      console.log('📊 Fetching dashboard from:', `${API_URL}/api/farmer/dashboard/`);
      const response = await fetch(`${API_URL}/api/farmer/dashboard/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📊 Dashboard response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dashboard loaded successfully:', data);
        setDashboardData(data);
        return data;
      } else if (response.status === 401) {
        console.log('🔴 Token expired or invalid (401), logging out');
        await logout();
      } else {
        const errorText = await response.text();
        console.log('❌ Dashboard error response:', response.status, errorText);
      }
      return null;
    } catch (error) {
      console.error('❌ Load dashboard error:', error);
      return null;
    }
  };

  const logout = async () => {
    console.log('🚪 logout called');
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        console.log('🚪 Calling logout API');
        await fetch(`${API_URL}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setDashboardData(null);
      console.log('✅ Cleaned up storage and state');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        dashboardData,
        requestOtp, 
        verifyOtp, 
        logout, 
        loadDashboard 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);