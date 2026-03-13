import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import { api, type NewsPost } from '@/lib/api';

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNews().then(setPosts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Tin tức & Bài viết</h1>
      </div>

      {loading && <p className="text-center py-12 text-muted-foreground">Đang tải...</p>}

      {!loading && posts.length === 0 && (
        <p className="text-center py-12 text-muted-foreground">Chưa có bài viết nào.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map(post => (
          <Link
            key={post.id}
            to={`/news/${post.id}`}
            className="group bg-card border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
          >
            {post.image ? (
              <div className="aspect-video overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Newspaper className="w-10 h-10 text-muted-foreground/40" />
              </div>
            )}
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-2">{post.createdAt}</p>
              <h2 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors mb-2">{post.title}</h2>
              {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3">
                Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
