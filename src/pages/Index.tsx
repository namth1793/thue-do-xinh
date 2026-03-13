import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, type Product, type SiteSettings, type NewsPost } from '@/lib/api';

const DEFAULT_SETTINGS: SiteSettings = {
  heroImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600&h=900&fit=crop',
  heroTitle: 'Khám phá Mộc Châu trên những chiếc Triumph',
  heroSubtitle: 'Thuê xe máy chất lượng cao, trải nghiệm cung đường đẹp nhất tại Mộc Châu. Đặt xe ngay hôm nay!',
};

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [news, setNews] = useState<NewsPost[]>([]);

  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => {});
    api.getSettings().then(setSettings).catch(() => {});
    api.getNews().then(n => setNews(n.slice(0, 3))).catch(() => {});
  }, []);

  const featured = products.filter(p => p.status === 'available').slice(0, 4);

  const heroImage = settings.heroImage || DEFAULT_SETTINGS.heroImage;
  const heroTitle = settings.heroTitle || DEFAULT_SETTINGS.heroTitle;
  const heroSubtitle = settings.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle;

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[420px] overflow-hidden">
        <img
          src={heroImage}
          alt="Phan Hoa Motorbike Rental"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
          <p className="text-white/85 text-base md:text-lg mb-6 max-w-lg">
            {heroSubtitle}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-full font-semibold text-sm w-fit hover:opacity-90 transition-opacity shadow-lg"
          >
            Xem xe ngay
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Featured bikes */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">Xe nổi bật</h2>
          <Link to="/products" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {featured.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Chưa có xe nào.</p>
        )}
      </section>

      {/* News preview */}
      {news.length > 0 && (
        <section className="bg-secondary/30 py-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                Tin tức mới nhất
              </h2>
              <Link to="/news" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {news.map(post => (
                <Link key={post.id} to={`/news/${post.id}`} className="group bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors">
                  {post.image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{post.createdAt}</p>
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Phan Hoa Motorbike Rental Mộc Châu</p>
          <p>© 2026 Phan Hoa Motorbike Rental. Mọi quyền được bảo lưu.</p>
          <p className="mt-1">📞 0931.6868.97 · Mộc Châu, Sơn La</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
