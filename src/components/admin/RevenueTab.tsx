import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api, type RevenueData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/data/products';

function StatCard({
  title,
  value,
  icon: Icon,
  sub,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function formatRevenue(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

export function RevenueTab() {
  const { toast } = useToast();
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRevenue()
      .then(setData)
      .catch(() => toast({ title: 'Lỗi', description: 'Không tải được dữ liệu doanh thu', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Tổng doanh thu"
          value={formatPrice(data.totalRevenue)}
          icon={TrendingUp}
          sub="Toàn bộ thời gian"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={data.totalOrders.toString()}
          icon={ShoppingBag}
          sub="Tất cả đơn"
        />
        <StatCard
          title="Doanh thu tháng này"
          value={formatPrice(data.thisMonthRevenue)}
          icon={Calendar}
          sub={`${data.thisMonthOrders} đơn tháng này`}
        />
        <StatCard
          title="Sản phẩm hot nhất"
          value={data.topProducts[0]?.count + ' lần' ?? '—'}
          icon={Award}
          sub={data.topProducts[0]?.name ?? ''}
        />
      </div>

      {/* Monthly chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Doanh thu 6 tháng gần nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.monthlyData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={formatRevenue} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => [formatPrice(value), 'Doanh thu']}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top sản phẩm được thuê nhiều</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-4">{i + 1}.</span>
                <span className="line-clamp-1">{p.name}</span>
              </div>
              <span className="font-medium shrink-0 ml-2">{p.count} lần</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.recentOrders.map(order => (
            <div key={order.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
              <div>
                <p className="font-medium line-clamp-1">{order.productName}</p>
                <p className="text-muted-foreground text-xs">{order.customerName} · {order.rentalDate}</p>
              </div>
              <span className="font-medium text-primary shrink-0 ml-2">{formatPrice(order.totalPrice)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
