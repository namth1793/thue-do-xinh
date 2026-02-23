import { LogOut, Package, BarChart2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ProductsTab } from './ProductsTab';
import { RevenueTab } from './RevenueTab';

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminPanel({ open, onOpenChange }: AdminPanelProps) {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-left">Quản trị Admin</SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{user?.name} · {user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-1.5" />
              Đăng xuất
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Tabs defaultValue="products">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="products" className="flex-1">
                <Package className="w-4 h-4 mr-1.5" />
                Sản phẩm
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex-1">
                <BarChart2 className="w-4 h-4 mr-1.5" />
                Doanh thu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>

            <TabsContent value="revenue">
              <RevenueTab />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
