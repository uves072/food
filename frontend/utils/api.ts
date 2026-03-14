import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';
const API_BASE = `${BACKEND_URL}/api`;

export const api = {
  // Menu endpoints
  getMenu: async () => {
    const response = await fetch(`${API_BASE}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu');
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE}/menu/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  createMenuItem: async (item: any) => {
    const response = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create menu item');
    return response.json();
  },

  updateMenuItem: async (itemId: string, item: any) => {
    const response = await fetch(`${API_BASE}/menu/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update menu item');
    return response.json();
  },

  deleteMenuItem: async (itemId: string) => {
    const response = await fetch(`${API_BASE}/menu/${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete menu item');
    return response.json();
  },

  // Order endpoints
  createOrder: async (order: any) => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  getOrders: async () => {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  getOrder: async (orderId: string) => {
    const response = await fetch(`${API_BASE}/orders/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  // Admin endpoints
  adminLogin: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    return response.json();
  },

  adminRegister: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE}/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    return response.json();
  },
};