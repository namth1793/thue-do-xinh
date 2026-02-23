import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Product } from '@/lib/api';

const CATEGORIES = ['Váy dạ hội', 'Áo dài', 'Vest nam', 'Đồ cưới', 'Đồ cosplay', 'Đồ công sở'];

const productSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  price: z.coerce.number().min(1000, 'Giá tối thiểu 1.000đ'),
  description: z.string().optional(),
  category: z.string().min(1, 'Chọn danh mục'),
  condition: z.enum(['new', 'used']),
  image: z.string().url('URL hình ảnh không hợp lệ').or(z.literal('')),
  status: z.enum(['available', 'rented']),
});

type ProductForm = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
}

export function ProductFormDialog({ open, onOpenChange, product, onSubmit }: ProductFormDialogProps) {
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      condition: 'new',
      status: 'available',
      image: '',
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        condition: product.condition,
        image: product.image,
        status: product.status,
      });
    } else {
      reset({ condition: 'new', status: 'available', image: '' });
    }
  }, [product, reset]);

  async function handleFormSubmit(data: ProductForm) {
    await onSubmit({
      ...data,
      description: data.description || '',
      image: data.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop',
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Tên sản phẩm *</Label>
            <Input placeholder="Váy dạ hội đỏ..." {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Giá thuê (đ) *</Label>
              <Input type="number" placeholder="350000" {...register('price')} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Danh mục *</Label>
              <Select
                value={watch('category')}
                onValueChange={val => setValue('category', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tình trạng</Label>
              <Select
                value={watch('condition')}
                onValueChange={val => setValue('condition', val as 'new' | 'used')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Mới</SelectItem>
                  <SelectItem value="used">Đã qua sử dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select
                value={watch('status')}
                onValueChange={val => setValue('status', val as 'available' | 'rented')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Có sẵn</SelectItem>
                  <SelectItem value="rented">Đang cho thuê</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>URL hình ảnh</Label>
            <Input
              placeholder="https://..."
              {...register('image')}
            />
            {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Mô tả</Label>
            <Textarea
              placeholder="Mô tả chi tiết sản phẩm..."
              rows={3}
              {...register('description')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : isEditing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
