import { useState, useEffect } from 'react';
import heroBanner from '@/assets/hero-banner.jpg';
import ProductCard from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, type Product } from '@/lib/api';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => {});
  }, []);

  const featured = products.filter(p => p.status === 'available').slice(0, 4);
  const newArrivals = products.filter(p => p.condition === 'new').slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={heroBanner}
          alt="Bộ sưu tập cho thuê"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3 max-w-lg">
            Thuê đồ đẹp, giá hợp lý
          </h1>
          <p className="text-primary-foreground/80 text-base md:text-lg mb-5 max-w-md">
            Đa dạng quần áo thời trang cho mọi dịp. Thuê dễ dàng, trả tiện lợi.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm w-fit hover:opacity-90 transition-opacity"
          >
            Xem sản phẩm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Nổi bật</h2>
          <Link to="/products" className="text-sm text-primary font-medium flex items-center gap-1">
            Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Đồ mới về</h2>
          <Link to="/products?condition=new" className="text-sm text-primary font-medium flex items-center gap-1">
            Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Thuê Đồ Đẹp. Mọi quyền được bảo lưu.</p>
          <p className="mt-1">Liên hệ: 0123 456 789 | info@thuedodep.vn</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;