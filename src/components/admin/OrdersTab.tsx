import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, RefreshCw, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, type Order } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/data/products';

const STATUS_CONFIG: Record<Order['status'], {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
}> = {
  pending:   { label: 'Chờ xác nhận', variant: 'secondary' },
  confirmed: { label: 'Đã xác nhận',  variant: 'default' },
  renting:   { label: 'Đang thuê',    variant: 'default' },
  completed: { label: 'Hoàn thành',   variant: 'outline' },
  cancelled: { label: 'Đã hủy',       variant: 'destructive' },
};

interface NewOrderForm {
  productName: string;
  customerName: string;
  customerPhone: string;
  rentalDate: string;
  returnDate: string;
  totalPrice: string;
}

const EMPTY_FORM: NewOrderForm = {
  productName: '', customerName: '', customerPhone: '',
  rentalDate: '', returnDate: '', totalPrice: '',
};

export function OrdersTab() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<NewOrderForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch {
      toast({ title: 'Lỗi', description: 'Không tải được đơn hàng', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function handleStatusChange(order: Order, status: Order['status']) {
    try {
      await api.updateOrderStatus(order.id, status);
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o));
      toast({ title: 'Đã cập nhật trạng thái' });
    } catch {
      toast({ title: 'Lỗi', description: 'Không cập nhật được', variant: 'destructive' });
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.deleteOrder(deleteId);
      toast({ title: 'Đã xóa đơn hàng' });
      fetchOrders();
    } catch (err) {
      toast({ title: 'Lỗi', description: err instanceof Error ? err.message : 'Không xóa được', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  }

  async function handleAddOrder() {
    if (!form.productName || !form.customerName || !form.rentalDate || !form.returnDate || !form.totalPrice) {
      toast({ title: 'Thiếu thông tin', description: 'Vui lòng điền đầy đủ các trường bắt buộc', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await api.createOrder({
        productId: '',
        productName: form.productName,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        rentalDate: form.rentalDate,
        returnDate: form.returnDate,
        totalPrice: Number(form.totalPrice),
      });
      toast({ title: 'Đã thêm đơn hàng mới' });
      setForm(EMPTY_FORM);
      setAddOpen(false);
      fetchOrders();
    } catch (err) {
      toast({ title: 'Lỗi', description: err instanceof Error ? err.message : 'Không thêm được', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  function setField(field: keyof NewOrderForm, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{orders.length} đơn hàng</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Thêm đơn
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm / Khách</TableHead>
              <TableHead>Ngày thuê</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Xóa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Đang tải...</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Chưa có đơn hàng</TableCell>
              </TableRow>
            ) : orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>
                  <p className="font-medium text-sm line-clamp-1">{order.productName}</p>
                  <p className="text-xs text-muted-foreground">{order.customerName}</p>
                  {order.customerPhone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />{order.customerPhone}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  <p>{order.rentalDate}</p>
                  <p className="text-muted-foreground">→ {order.returnDate}</p>
                </TableCell>
                <TableCell className="text-sm font-medium text-primary">
                  {formatPrice(order.totalPrice)}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={val => handleStatusChange(order, val as Order['status'])}
                  >
                    <SelectTrigger className="h-8 w-36 text-xs border-0 p-0 shadow-none">
                      <Badge variant={STATUS_CONFIG[order.status].variant} className="text-xs cursor-pointer">
                        {STATUS_CONFIG[order.status].label}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(STATUS_CONFIG) as [Order['status'], typeof STATUS_CONFIG[Order['status']]][]).map(([val, cfg]) => (
                        <SelectItem key={val} value={val} className="text-xs">{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(order.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add order dialog */}
      <Dialog open={addOpen} onOpenChange={open => { setAddOpen(open); if (!open) setForm(EMPTY_FORM); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm đơn hàng mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Tên sản phẩm *</Label>
              <Input value={form.productName} onChange={e => setField('productName', e.target.value)} placeholder="Váy dạ hội đỏ..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tên khách hàng *</Label>
                <Input value={form.customerName} onChange={e => setField('customerName', e.target.value)} placeholder="Nguyễn Thị A" />
              </div>
              <div className="space-y-1.5">
                <Label>Số điện thoại</Label>
                <Input value={form.customerPhone} onChange={e => setField('customerPhone', e.target.value)} placeholder="0912345678" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Ngày thuê *</Label>
                <Input type="date" value={form.rentalDate} onChange={e => setField('rentalDate', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Ngày trả *</Label>
                <Input type="date" value={form.returnDate} onChange={e => setField('returnDate', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tổng tiền (đ) *</Label>
              <Input type="number" value={form.totalPrice} onChange={e => setField('totalPrice', e.target.value)} placeholder="350000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Hủy</Button>
            <Button onClick={handleAddOrder} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Thêm đơn hàng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn chắc chắn muốn xóa đơn hàng này?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}