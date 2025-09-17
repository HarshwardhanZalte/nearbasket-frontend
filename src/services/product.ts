import { apiService } from './api';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types';

export const productService = {
  // List products for a shop
  async getShopProducts(shopId: number) {
    return apiService.get<Product[]>(`/products/shops/${shopId}/products/`);
  },

  // Create a new product (shopkeeper only)
  async createProduct(shopId: number, data: CreateProductRequest) {
    return apiService.post<Product>(`/products/shops/${shopId}/products/`, data);
  },

  // Get product details
  async getProduct(shopId: number, productId: number) {
    return apiService.get<Product>(`/products/shops/${shopId}/products/${productId}/`);
  },

  // Update product (shop owner only)
  async updateProduct(shopId: number, productId: number, data: UpdateProductRequest) {
    return apiService.put<Product>(`/products/shops/${shopId}/products/${productId}/`, data);
  },

  // Delete product (shop owner only)
  async deleteProduct(shopId: number, productId: number) {
    return apiService.delete<{ message: string }>(`/products/shops/${shopId}/products/${productId}/`);
  },
};
