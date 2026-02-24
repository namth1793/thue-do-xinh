import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function Cart() {
  const { items, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const total = items.reduce((sum, item) => {
    const days = Math.max(1, Math.ceil(
      (new Date(item.returnDate).getTime() - new Date(item.rentalDate).getTime()) / (1000 * 60 * 60 * 24)
    ));
    return sum + item.product.price * days;
  }, 0);

  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Vui lòng nhập tên và số điện thoại');
      return;
    }
    setSubmitting(true);
    try {
      for (const item of items) {
        const days = Math.max(1, Math.ceil(
          (new Date(item.returnDate).getTime() - new Date(item.rentalDate).getTime()) / (1000 * 60 * 60 * 24)
        ));
        await api.createOrder({
          productId: item.product.id,
          productName: item.product.name,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          rentalDate: item.rentalDate,
          returnDate: item.returnDate,
          totalPrice: item.product.price * days,
        });
      }
      toast.success('Đặt thuê thành công! Chúng tôi sẽ liên hệ bạn sớm.');
      clearCart();
      navigate('/');
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h1 className="text-xl font-bold text-foreground mb-2">Giỏ hàng trống</h1>
        <p className="text-sm text-muted-foreground mb-4">Hãy chọn sản phẩm bạn muốn thuê</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium"
        >
          Xem sản phẩm
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-lg">
      <h1 className="text-2xl font-bold text-foreground mb-4">Giỏ hàng ({items.length})</h1>

      <div className="space-y-3 mb-6">
        {items.map(item => {
          const days = Math.max(1, Math.ceil(
            (new Date(item.returnDate).getTime() - new Date(item.rentalDate).getTime()) / (1000 * 60 * 60 * 24)
          ));
          return (
            <div key={item.product.id} className="flex gap-3 bg-card border rounded-lg p-3">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-24 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-card-foreground line-clamp-1">{item.product.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.rentalDate} → {item.returnDate} ({days} ngày)
                </p>
                <p className="text-sm font-bold text-price mt-1">{formatPrice(item.product.price * days)}</p>
              </div>
              <button
                onClick={() => removeItem(item.product.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive self-start"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Customer info */}
      <div className="space-y-3 mb-6">
        <h2 className="text-base font-semibold text-foreground">Thông tin khách hàng</h2>
        <input
          type="text"
          placeholder="Họ và tên"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          className="w-full px-3 py-3 text-sm rounded-lg border bg-card text-foreground placeholder:text-muted-foreground"
        />
        <input
          type="tel"
          placeholder="Số điện thoại"
          value={customerPhone}
          onChange={e => setCustomerPhone(e.target.value)}
          className="w-full px-3 py-3 text-sm rounded-lg border bg-card text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Total & checkout */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-foreground">Tổng cộng</span>
          <span className="text-xl font-bold text-price">{formatPrice(total)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {submitting ? 'Đang xử lý...' : 'Đặt thuê ngay'}
        </button>
      </div>
    </main>
  );
}
