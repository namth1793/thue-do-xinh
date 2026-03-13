import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProductFormDialog } from './ProductFormDialog';
import { api, type Product } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/data/products';

export function ProductsTab() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch {
      toast({ title: 'Lỗi', description: 'Không tải được danh sách sản phẩm', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function openAdd() {
    setEditProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditProduct(product);
    setFormOpen(true);
  }

  async function handleFormSubmit(data: Omit<Product, 'id'>) {
    if (editProduct) {
      await api.updateProduct(editProduct.id, data);
      toast({ title: 'Đã cập nhật sản phẩm' });
    } else {
      await api.createProduct(data);
      toast({ title: 'Đã thêm sản phẩm mới' });
    }
    fetchProducts();
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.deleteProduct(deleteId);
      toast({ title: 'Đã xóa sản phẩm' });
      fetchProducts();
    } catch (err) {
      toast({ title: 'Lỗi', description: err instanceof Error ? err.message : 'Không xóa được', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  }

  async function toggleStatus(product: Product) {
    const newStatus = product.status === 'available' ? 'rented' : 'available';
    try {
      await api.updateProductStatus(product.id, newStatus);
      toast({ title: `Đã chuyển sang "${newStatus === 'available' ? 'Có sẵn' : 'Không có sẵn'}"` });
      fetchProducts();
    } catch {
      toast({ title: 'Lỗi', description: 'Không đổi được trạng thái', variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} sản phẩm</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead className="hidden sm:table-cell">Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Chưa có sản phẩm nào
                </TableCell>
              </TableRow>
            ) : (
              products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover shrink-0"
                      />
                      <span className="font-medium text-xs sm:text-sm line-clamp-2 max-w-[100px] sm:max-w-none">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{product.category}</TableCell>
                  <TableCell className="text-xs sm:text-sm font-medium text-primary whitespace-nowrap">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleStatus(product)}
                      className="cursor-pointer"
                      title="Click để đổi trạng thái"
                    >
                      <Badge variant={product.status === 'available' ? 'default' : 'destructive'} className="text-xs whitespace-nowrap">
                        {product.status === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => openEdit(product)}>
                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}