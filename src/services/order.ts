import { apiService } from './api';
import {
  Order,
  PlaceOrderRequest,
  UpdateOrderStatusRequest,
} from '@/types';

export const orderService = {
  // Place an order (customer only)
  async placeOrder(shopId: number, data: PlaceOrderRequest) {
    return apiService.post<Order>(`/orders/shops/${shopId}/orders/`, data);
  },

  // Get my orders (customer only)
  async getMyOrders() {
    return apiService.get<Order[]>('/orders/my-orders/');
  },

  // Get order details
  async getOrderDetails(orderId: number) {
    return apiService.get<Order>(`/orders/${orderId}/`);
  },

  // Get shop orders (shopkeeper only)
  async getShopOrders(shopId: number) {
    return apiService.get<Order[]>(`/orders/shops/${shopId}/orders/list/`);
  },

  // Update order status (shopkeeper only)
  async updateOrderStatus(orderId: number, data: UpdateOrderStatusRequest) {
    return apiService.put<Order>(`/orders/${orderId}/status/`, data);
  },
};
