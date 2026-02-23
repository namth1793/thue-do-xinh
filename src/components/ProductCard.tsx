import { Link } from 'react-router-dom';
import { Product, formatPrice } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-card border">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full text-primary-foreground font-medium ${
            product.condition === 'new' ? 'bg-badge-new' : 'bg-badge-used'
          }`}>
            {product.condition === 'new' ? 'Mới' : 'Đã qua SD'}
          </span>
        </div>
        {product.status === 'rented' && (
          <div className="absolute top-2 right-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-status-rented text-primary-foreground font-medium">
              Đã thuê
            </span>
          </div>
        )}
        <div className="p-3">
          <h3 className="text-sm font-medium text-card-foreground line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-base font-bold text-price">{formatPrice(product.price)}/ngày</p>
        </div>
      </div>
    </Link>
  );
}
