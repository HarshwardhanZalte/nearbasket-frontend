// NearBasket Data Models - Updated to match API

export interface User {
  id: number;
  mobile_number: string;
  name: string;
  email?: string;
  address?: string;
  profile_image_url?: string;
  role: 'CUSTOMER' | 'SHOPKEEPER';
  created_at: string;
  shop?: Shop | null;
}

export interface Shop {
  id: number;
  name: string;
  address: string;
  description: string;
  shop_logo_url?: string;
  shop_id: string;
  created_at: string;
  owner_name?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  product_image_url?: string;
  created_at: string;
  shop_name?: string;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  customer: User;
  shop: Shop;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DELIVERED';
  total_amount: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface ShopCustomer {
  id: number;
  customer: User;
  shop_name: string;
  joined_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  shopId: number; // Store the shop's internal ID for order placement
}

// Request/Response types
export interface RegisterRequest {
  mobile_number: string;
  name: string;
  email?: string;
  address?: string;
  profile_image_url?: string;
  role: 'CUSTOMER' | 'SHOPKEEPER';
  shop_info?: {
    name: string;
    address: string;
    description: string;
    shop_logo_url?: string;
  };
}

export interface SendOtpRequest {
  mobile_number: string;
}

export interface SendOtpResponse {
  message: string;
  otp: string;
}

export interface VerifyOtpRequest {
  mobile_number: string;
  otp_code: string;
}

export interface LoginResponse {
  message: string;
  access: string;
  refresh: string;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  address?: string;
  profile_image_url?: string;
}

export interface UpdateShopRequest {
  name?: string;
  address?: string;
  description?: string;
  shop_logo_url?: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  product_image_url?: string;
  description: string;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  stock?: number;
  product_image_url?: string;
  description?: string;
}

export interface PlaceOrderRequest {
  items: {
    product_id: string;
    quantity: string;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DELIVERED';
}

export type UserRole = 'CUSTOMER' | 'SHOPKEEPER';