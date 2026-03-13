import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { api, type NewsPost } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const EMPTY_FORM = { title: '', excerpt: '', content: '', image: '' };

export function BlogTab() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<NewsPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      setPosts(await api.getNews());
    } catch {
      toast({ title: 'Lỗi', description: 'Không tải được bài viết', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function openAdd() {
    setEditPost(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(post: NewsPost) {
    setEditPost(post);
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, image: post.image });
    setFormOpen(true);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setForm(f => ({ ...f, image: url }));
    } catch {
      toast({ title: 'Upload thất bại', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSave() {
    if (!form.title || !form.content) {
      toast({ title: 'Thiếu tiêu đề hoặc nội dung', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (editPost) {
        await api.updateNews(editPost.id, form);
        toast({ title: 'Đã cập nhật bài viết' });
      } else {
        await api.createNews(form);
        toast({ title: 'Đã thêm bài viết mới' });
      }
      setFormOpen(false);
      fetchPosts();
    } catch (err) {
      toast({ title: 'Lỗi', description: err instanceof Error ? err.message : 'Không lưu được', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.deleteNews(deleteId);
      toast({ title: 'Đã xóa bài viết' });
      fetchPosts();
    } catch {
      toast({ title: 'Lỗi xóa bài', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} bài viết</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchPosts} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-1" />Thêm bài
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">Đang tải...</p>
        ) : posts.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">Chưa có bài viết nào</p>
        ) : posts.map(post => (
          <div key={post.id} className="flex gap-3 items-center border rounded-lg p-3 bg-card">
            {post.image && (
              <img src={post.image} alt={post.title} className="w-16 h-12 object-cover rounded shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{post.title}</p>
              <p className="text-xs text-muted-foreground">{post.createdAt}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(post)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(post.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Form dialog */}
      <Dialog open={formOpen} onOpenChange={open => { setFormOpen(open); if (!open) setForm(EMPTY_FORM); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image */}
            <div className="space-y-2">
              <Label>Ảnh bìa</Label>
              {form.image && (
                <div className="relative rounded overflow-hidden border aspect-video mb-1">
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setForm(f => ({ ...f, image: '' }))}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Đang tải...</> : <><ImagePlus className="w-4 h-4 mr-1" />Upload</>}
                </Button>
                <Input placeholder="Hoặc nhập URL ảnh..." value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="flex-1" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tiêu đề *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Tiêu đề bài viết..." />
            </div>
            <div className="space-y-1.5">
              <Label>Tóm tắt</Label>
              <Input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Mô tả ngắn..." />
            </div>
            <div className="space-y-1.5">
              <Label>Nội dung *</Label>
              <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Nội dung chi tiết..." rows={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : editPost ? 'Lưu thay đổi' : 'Đăng bài'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn chắc chắn muốn xóa bài viết này?</AlertDialogDescription>
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
