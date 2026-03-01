import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load auth data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (username: string, password: string): Promise<boolean> => {
    try {
      // First, get CSRF token
      const csrfResponse = await fetch(`${API_URL}/accounts/login/`, {
        method: 'GET',
      });
      const html = await csrfResponse.text();
      const csrfMatch = html.match(/name="csrfmiddlewaretoken" value="([^"]+)"/);
      const csrfToken = csrfMatch ? csrfMatch[1] : '';

      // Create form data for login
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('csrfmiddlewaretoken', csrfToken);

      // Send login request
      const loginResponse = await fetch(`${API_URL}/accounts/login/`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      });

      if (loginResponse.ok) {
        // Get user data from our API
        const userResponse = await fetch(`${API_URL}/api/farmer/profile/`, {
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signOut = async () => {
    await fetch(`${API_URL}/accounts/logout/`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);