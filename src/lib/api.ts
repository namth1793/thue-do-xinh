const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Lỗi kết nối server' }));
    throw new Error(error.message || 'Có lỗi xảy ra');
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; name: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  // Upload image
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload thất bại' }));
      throw new Error(err.message);
    }
    return res.json();
  },

  // Products (public)
  getProducts: () => request<Product[]>('/products'),
  getProduct: (id: string) => request<Product>(`/products/${id}`),

  // Products (admin)
  createProduct: (data: Omit<Product, 'id'>) =>
    request<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<Product>) =>
    request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateProductStatus: (id: string, status: 'available' | 'rented') =>
    request<Product>(`/products/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteProduct: (id: string) =>
    request<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),

  // Revenue (admin)
  getRevenue: () => request<RevenueData>('/revenue'),

  // Orders (admin)
  getOrders: () => request<Order[]>('/orders'),
  createOrder: (data: Omit<Order, 'id' | 'status' | 'createdAt'>) =>
    request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (id: string, status: Order['status']) =>
    request<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteOrder: (id: string) =>
    request<{ message: string }>(`/orders/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => request<SiteSettings>('/settings'),
  updateSettings: (data: Partial<SiteSettings>) =>
    request<SiteSettings>('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // News
  getNews: () => request<NewsPost[]>('/news'),
  getNewsPost: (id: string) => request<NewsPost>(`/news/${id}`),
  createNews: (data: Omit<NewsPost, 'id' | 'createdAt'>) =>
    request<NewsPost>('/news', { method: 'POST', body: JSON.stringify(data) }),
  updateNews: (id: string, data: Partial<NewsPost>) =>
    request<NewsPost>(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNews: (id: string) =>
    request<{ message: string }>(`/news/${id}`, { method: 'DELETE' }),
};

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  condition: 'new' | 'used';
  image: string;
  status: 'available' | 'rented';
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  rentalDate: string;
  returnDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'renting' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface RevenueData {
  totalRevenue: number;
  totalOrders: number;
  thisMonthRevenue: number;
  thisMonthOrders: number;
  monthlyData: { month: string; revenue: number; orders: number }[];
  topProducts: { name: string; count: number }[];
  recentOrders: {
    id: string;
    productName: string;
    customerName: string;
    rentalDate: string;
    returnDate: string;
    totalPrice: number;
    createdAt: string;
  }[];
}

export interface SiteSettings {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt?: string;
}
