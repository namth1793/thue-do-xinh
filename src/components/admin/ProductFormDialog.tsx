import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { api, type Product } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = ['Xe côn', 'Xe ga', 'Xe số', 'Xe cao cấp'];
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop';

const productSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  price: z.coerce.number().min(1000, 'Giá tối thiểu 1.000đ'),
  description: z.string().optional(),
  category: z.string().min(1, 'Chọn danh mục'),
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
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } =
    useForm<ProductForm>({
      resolver: zodResolver(productSchema),
      defaultValues: { status: 'available' },
    });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name, price: product.price, description: product.description,
        category: product.category, status: product.status,
      });
      setImageUrl(product.image || '');
    } else {
      reset({ status: 'available' });
      setImageUrl('');
    }
  }, [product, reset, open]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setImageUrl(url);
    } catch {
      toast({ title: 'Upload thất bại', description: 'Không thể tải ảnh lên', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleFormSubmit(data: ProductForm) {
    await onSubmit({
      name: data.name,
      price: data.price,
      description: data.description || '',
      category: data.category,
      condition: 'new',
      status: data.status,
      image: imageUrl || DEFAULT_IMAGE,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Sửa xe' : 'Thêm xe mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Image upload */}
          <div className="space-y-1.5">
            <Label>Hình ảnh</Label>
            <div className="flex gap-3 items-start">
              <div className="relative w-32 h-24 shrink-0 rounded-md overflow-hidden border bg-muted">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white hover:bg-black/70">
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImagePlus className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input ref={fileInputRef} type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="hidden" onChange={handleFileChange} />
                <Button type="button" variant="outline" size="sm" className="w-full"
                  onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang tải lên...</>
                    : <><ImagePlus className="w-4 h-4 mr-2" />Chọn ảnh từ máy</>}
                </Button>
                <p className="text-xs text-muted-foreground">JPG, PNG, WEBP · Tối đa 5MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tên xe *</Label>
            <Input placeholder="Triumph Tiger 900..." {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Giá thuê (đ/ngày) *</Label>
              <Input type="number" placeholder="350000" {...register('price')} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Danh mục *</Label>
              <Select value={watch('category')} onValueChange={val => setValue('category', val)}>
                <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tình trạng</Label>
            <Select value={watch('status')} onValueChange={val => setValue('status', val as 'available' | 'rented')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Có sẵn</SelectItem>
                <SelectItem value="rented">Không có sẵn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Mô tả</Label>
            <Textarea placeholder="Mô tả chi tiết về xe..." rows={3} {...register('description')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting ? 'Đang lưu...' : isEditing ? 'Lưu thay đổi' : 'Thêm xe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
