import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SendOtpRequest, VerifyOtpRequest } from '@/types';
import { authService } from '@/services/auth';
import { ApiError } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data and token
    const storedUser = localStorage.getItem('nearbasket_user');
    const token = localStorage.getItem('nearbasket_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('nearbasket_user');
        localStorage.removeItem('nearbasket_token');
      }
    }
    setIsLoading(false);
  }, []);

  const sendOtp = async (phone: string): Promise<{ success: boolean; message: string; otp?: string }> => {
    try {
      const response = await authService.sendOtp({ mobile_number: phone });
      return {
        success: true,
        message: response.message,
        otp: response.otp, // For development - remove in production
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.message || 'Failed to send OTP',
      };
    }
  };

  const verifyOtp = async (phone: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await authService.verifyOtp({
        mobile_number: phone,
        otp_code: otp,
      });
      
      setUser(response.user);
      localStorage.setItem('nearbasket_user', JSON.stringify(response.user));
      
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.message || 'Invalid OTP',
      };
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
    localStorage.removeItem('nearbasket_user');
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      localStorage.setItem('nearbasket_user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      sendOtp,
      verifyOtp,
      logout,
      updateUser,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};