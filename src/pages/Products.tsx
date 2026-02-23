import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState('Tất cả');
  const [condition, setCondition] = useState(
    searchParams.get('condition') === 'new' ? 'Đồ mới' : 'Tất cả'
  );

  const filtered = useMemo(() => {
    return mockProducts.filter(p => {
      if (category !== 'Tất cả' && p.category !== category) return false;
      if (condition === 'Đồ mới' && p.condition !== 'new') return false;
      if (condition === 'Đồ cũ' && p.condition !== 'used') return false;
      return true;
    });
  }, [category, condition]);

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">Tất cả sản phẩm</h1>
      <ProductFilter
        selectedCategory={category}
        selectedCondition={condition}
        onCategoryChange={setCategory}
        onConditionChange={setCondition}
      />
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Không tìm thấy sản phẩm nào.</p>
      )}
    </main>
  );
}
