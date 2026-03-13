import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, BarChart2, ClipboardList, Image, Newspaper, Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ProductsTab } from '@/components/admin/ProductsTab';
import { OrdersTab } from '@/components/admin/OrdersTab';
import { RevenueTab } from '@/components/admin/RevenueTab';
import { HeroTab } from '@/components/admin/HeroTab';
import { BlogTab } from '@/components/admin/BlogTab';

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
            <Package className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Đăng nhập Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Phan Hoa Motorbike Rental</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email" placeholder="admin@thuedo.vn"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Mật khẩu</Label>
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'} placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <div className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-primary text-lg">Admin Panel</span>
            <span className="text-xs text-muted-foreground hidden sm:block">· {user?.name} · {user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-1.5" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="products">
          <TabsList className="mb-6 flex flex-wrap gap-1 h-auto bg-muted p-1 rounded-xl">
            <TabsTrigger value="products" className="flex items-center gap-1.5 rounded-lg">
              <Package className="w-4 h-4" />
              <span>Xe</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1.5 rounded-lg">
              <ClipboardList className="w-4 h-4" />
              <span>Đơn hàng</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-1.5 rounded-lg">
              <BarChart2 className="w-4 h-4" />
              <span>Doanh thu</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-1.5 rounded-lg">
              <Image className="w-4 h-4" />
              <span>Ảnh bìa</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-1.5 rounded-lg">
              <Newspaper className="w-4 h-4" />
              <span>Tin tức</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="revenue">
            <RevenueTab />
          </TabsContent>
          <TabsContent value="hero">
            <HeroTab />
          </TabsContent>
          <TabsContent value="blog">
            <BlogTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
