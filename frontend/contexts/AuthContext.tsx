import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAdmin: boolean;
  adminToken: string | null;
  adminUsername: string | null;
  login: (username: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      const username = await AsyncStorage.getItem('adminUsername');
      if (token && username) {
        setIsAdmin(true);
        setAdminToken(token);
        setAdminUsername(username);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, token: string) => {
    try {
      await AsyncStorage.setItem('adminToken', token);
      await AsyncStorage.setItem('adminUsername', username);
      setIsAdmin(true);
      setAdminToken(token);
      setAdminUsername(username);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('adminToken');
      await AsyncStorage.removeItem('adminUsername');
      setIsAdmin(false);
      setAdminToken(null);
      setAdminUsername(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        adminToken,
        adminUsername,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};