import { useState, useEffect, useMemo } from 'react';
import { api, type Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('Tất cả');

  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (category !== 'Tất cả' && p.category !== category) return false;
      return true;
    });
  }, [products, category]);

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">Tất cả xe cho thuê</h1>
      <ProductFilter
        selectedCategory={category}
        onCategoryChange={setCategory}
      />
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Không tìm thấy xe nào.</p>
      )}
    </main>
  );
}
