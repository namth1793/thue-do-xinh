import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, type Product } from '@/lib/api';
import { formatPrice } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const [rentalDate, setRentalDate] = useState(today);
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    if (!id) return;
    api.getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-primary font-medium">
          ← Quay lại
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!returnDate) {
      toast.error('Vui lòng chọn ngày trả');
      return;
    }
    addItem({ product, rentalDate, returnDate });
    toast.success('Đã thêm vào giỏ hàng!');
  };

  return (
    <main className="container mx-auto px-4 py-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại
      </button>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="relative rounded-lg overflow-hidden bg-card">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-[3/4] object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={`text-xs px-2.5 py-1 rounded-full text-primary-foreground font-medium ${
              product.condition === 'new' ? 'bg-badge-new' : 'bg-badge-used'
            }`}>
              {product.condition === 'new' ? 'Mới' : 'Đã qua SD'}
            </span>
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-price mb-1">{formatPrice(product.price)}/ngày</p>

          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1 text-sm font-medium ${
              product.status === 'available' ? 'text-foreground' : 'text-destructive'
            }`}>
              <span className={`h-2 w-2 rounded-full ${
                product.status === 'available' ? 'bg-status-available' : 'bg-status-rented'
              }`} />
              {product.status === 'available' ? 'Còn hàng' : 'Đã cho thuê'}
            </span>
            <span className="text-sm text-muted-foreground">• {product.category}</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          {product.status === 'available' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ngày thuê</label>
                  <input
                    type="date"
                    value={rentalDate}
                    min={today}
                    onChange={e => setRentalDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border bg-card text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ngày trả</label>
                  <input
                    type="date"
                    value={returnDate}
                    min={rentalDate}
                    onChange={e => setReturnDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border bg-card text-foreground"
                  />
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="h-4 w-4" />
                Thêm vào giỏ
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}