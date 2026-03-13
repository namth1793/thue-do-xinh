import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { api, type NewsPost } from '@/lib/api';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getNewsPost(id).then(setPost).catch(() => setPost(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Đang tải...</div>;

  if (!post) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <p className="text-muted-foreground">Không tìm thấy bài viết</p>
      <button onClick={() => navigate('/news')} className="mt-4 text-primary font-medium">← Quay lại tin tức</button>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-6 max-w-3xl">
      <Link to="/news" className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Quay lại tin tức
      </Link>

      {post.image && (
        <div className="rounded-xl overflow-hidden mb-6 aspect-video">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
        <Newspaper className="w-4 h-4" />
        <span>{post.createdAt}</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-3">{post.title}</h1>

      {post.excerpt && (
        <p className="text-base text-muted-foreground border-l-4 border-primary pl-4 mb-6">{post.excerpt}</p>
      )}

      <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
    </main>
  );
}
