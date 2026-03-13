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

export const categories = [
  'Tất cả',
  'Xe côn',
  'Xe ga',
  'Xe số',
  'Xe cao cấp',
];

export const mockProducts: Product[] = [];

export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}
