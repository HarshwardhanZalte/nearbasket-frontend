// NearBasket Data Models

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  role: 'customer' | 'shopkeeper';
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  image?: string;
  owner: string;
  rating: number;
  isOpen: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  shopId: string;
  inStock: boolean;
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  shopId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'accepted' | 'rejected' | 'delivered';
  createdAt: string;
  deliveryAddress: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
}

export type UserRole = 'customer' | 'shopkeeper';