import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Lock, ShieldCheck } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from '@/components/LoginDialog';
import { AdminPanel } from '@/components/admin/AdminPanel';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Trang chủ' },
    { to: '/products', label: 'Sản phẩm' },
  ];

  function handleAdminClick() {
    if (isAuthenticated) {
      setAdminOpen(true);
    } else {
      setLoginOpen(true);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="Phan Hoa Motorbike Rental" className="h-14 w-auto object-contain" />
          </Link>

          {/* Site name — center */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center leading-tight pointer-events-none select-none">
            <span className="text-base font-bold text-primary tracking-wide">Phan Hoa Motorbike Rental</span>
            <span className="text-sm font-medium text-muted-foreground">Mộc Châu</span>
          </div>

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
            <button
              onClick={handleAdminClick}
              title={isAuthenticated ? 'Mở trang quản trị' : 'Đăng nhập Admin'}
              className={`p-2 transition-colors ${
                isAuthenticated
                  ? 'text-primary hover:text-primary/80'
                  : 'text-muted-foreground/50 hover:text-muted-foreground'
              }`}
            >
              {isAuthenticated ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </button>
          </nav>

          {/* Mobile nav */}
          <div className="flex items-center gap-1 md:hidden">
            <Link to="/cart" className="relative p-2">
              <ShoppingBag className="h-5 w-5 text-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleAdminClick}
              title={isAuthenticated ? 'Mở trang quản trị' : 'Đăng nhập Admin'}
              className={`p-2 transition-colors ${
                isAuthenticated ? 'text-primary' : 'text-muted-foreground/50'
              }`}
            >
              {isAuthenticated ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </button>
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

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSuccess={() => setAdminOpen(true)}
      />

      <AdminPanel open={adminOpen} onOpenChange={setAdminOpen} />
    </>
  );
}
