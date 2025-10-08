import { apiService } from './api';
import {
  RegisterRequest,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  LoginResponse,
  User,
  UpdateProfileRequest,
} from '@/types';

export const authService = {
  // Register a new user
  async register(data: RegisterRequest) {
    return apiService.post<{ message: string; user: User }>('/users/register/', data);
  },

  // Send OTP to mobile number
  async sendOtp(data: SendOtpRequest) {
    return apiService.post<SendOtpResponse>('/users/send-otp/', data, true); // skipAuth = true
  },

  // Verify OTP and login
  async verifyOtp(data: VerifyOtpRequest) {
    const response = await apiService.post<LoginResponse>('/users/verify-otp/', data, true); // skipAuth = true since this is part of auth flow
    
    // Store the access token
    if (response.access) {
      apiService.setToken(response.access);
    }
    
    return response;
  },

  // Get current user profile
  async getProfile() {
    return apiService.get<User>('/users/me/');
  },

  // Update user profile
  async updateProfile(data: UpdateProfileRequest) {
    return apiService.put<User>('/users/me/update/', data);
  },

  // Logout (clear token)
  logout() {
    apiService.clearToken();
  },
};
