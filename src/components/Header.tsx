import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Trang chủ' },
    { to: '/products', label: 'Sản phẩm' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Thuê Đồ Đẹp
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/cart" className="relative p-2">
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile nav */}
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/cart" className="relative p-2">
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-b animate-in slide-in-from-top-2">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-2">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`py-2 text-sm font-medium ${
                  location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
