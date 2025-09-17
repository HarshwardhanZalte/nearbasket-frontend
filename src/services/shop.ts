import { apiService } from './api';
import {
  Shop,
  UpdateShopRequest,
  ShopCustomer,
  User,
} from '@/types';

export const shopService = {
  // Get my shop (shopkeeper) or joined shops (customer)
  async getMyShop() {
    return apiService.get<Shop | Shop[]>('/shops/my-shop/');
  },

  // Update my shop (shopkeeper only)
  async updateMyShop(data: UpdateShopRequest) {
    return apiService.put<Shop>('/shops/my-shop/update/', data);
  },

  // Get shop details by shop_id
  async getShopDetails(shopId: string) {
    return apiService.get<Shop>(`/shops/details/${shopId}/`);
  },

  // Join a shop (customer only)
  async joinShop(shopId: string) {
    return apiService.post<{ message: string; shop: Shop }>(`/shops/join/${shopId}/`);
  },

  // Add customer to shop (shopkeeper only)
  async addCustomer(mobileNumber: string) {
    return apiService.post<{ message: string; customer: User }>('/shops/add-customer/', {
      mobile_number: mobileNumber,
    });
  },

  // List shop customers (shopkeeper only)
  async getCustomers() {
    return apiService.get<ShopCustomer[]>('/shops/customers/');
  },

  // Remove customer from shop (shopkeeper only)
  async removeCustomer(userId: number) {
    return apiService.delete<{ message: string }>(`/shops/customers/${userId}/remove/`);
  },

  // Get my joined shops (customer only)
  async getJoinedShops() {
    return apiService.get<Shop[]>('/shops/my-joined-shops/');
  },
};
