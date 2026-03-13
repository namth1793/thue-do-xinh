import { useState, useEffect, useRef } from 'react';
import { Loader2, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, type SiteSettings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function HeroTab() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<SiteSettings>({ heroImage: '', heroTitle: '', heroSubtitle: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.getSettings()
      .then(setSettings)
      .catch(() => toast({ title: 'Lỗi', description: 'Không tải được cài đặt', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [toast]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setSettings(s => ({ ...s, heroImage: url }));
    } catch {
      toast({ title: 'Upload thất bại', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateSettings(settings);
      toast({ title: 'Đã lưu cài đặt trang chủ' });
    } catch {
      toast({ title: 'Lỗi', description: 'Không lưu được', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-12 text-muted-foreground">Đang tải...</div>;

  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label>Ảnh bìa trang chủ</Label>
        {settings.heroImage && (
          <div className="relative rounded-lg overflow-hidden border aspect-video mb-2">
            <img src={settings.heroImage} alt="Hero" className="w-full h-full object-cover" />
            <button
              onClick={() => setSettings(s => ({ ...s, heroImage: '' }))}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang tải...</>
              : <><ImagePlus className="w-4 h-4 mr-2" />Upload ảnh</>}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Hoặc nhập URL ảnh trực tiếp bên dưới</p>
        <Input
          placeholder="https://... (URL ảnh bìa)"
          value={settings.heroImage}
          onChange={e => setSettings(s => ({ ...s, heroImage: e.target.value }))}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Tiêu đề chính</Label>
        <Input
          value={settings.heroTitle}
          onChange={e => setSettings(s => ({ ...s, heroTitle: e.target.value }))}
          placeholder="Khám phá Mộc Châu trên những chiếc Triumph"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Tiêu đề phụ</Label>
        <Input
          value={settings.heroSubtitle}
          onChange={e => setSettings(s => ({ ...s, heroSubtitle: e.target.value }))}
          placeholder="Thuê xe máy chất lượng cao..."
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? 'Đang lưu...' : 'Lưu cài đặt trang chủ'}
      </Button>
    </div>
  );
}
