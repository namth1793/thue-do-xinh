import { Link } from 'react-router-dom';
import { Product, formatPrice } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-card border hover:border-primary/50 transition-colors">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        {product.status === 'rented' && (
          <div className="absolute top-2 right-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-status-rented text-white font-medium">
              Không có sẵn
            </span>
          </div>
        )}
        {product.status === 'available' && (
          <div className="absolute top-2 left-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-status-available text-white font-medium">
              Có sẵn
            </span>
          </div>
        )}
        <div className="p-2 sm:p-3">
          <span className="text-xs text-primary font-medium">{product.category}</span>
          <h3 className="text-xs sm:text-sm font-medium text-card-foreground line-clamp-2 mb-1 mt-0.5">
            {product.name}
          </h3>
          <p className="text-sm sm:text-base font-bold text-price">{formatPrice(product.price)}/ngày</p>
        </div>
      </div>
    </Link>
  );
}
