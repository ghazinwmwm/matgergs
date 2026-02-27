import { 
  TrendingUp, TrendingDown, ShoppingCart, Users, Package, 
  DollarSign, ArrowLeft, Clock, Eye, MoreHorizontal 
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { products } = useInventory();
  const navigate = useNavigate();

  const totalValue = products.reduce((sum, p) => {
    const final = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
    return sum + final;
  }, 0);

  // Mock merchant data
  const stats = {
    revenue: 2450000,
    revenueChange: 12.5,
    orders: 48,
    ordersChange: 8.3,
    customers: 156,
    customersChange: -2.1,
    products: products.length,
    visitors: 1240,
  };

  const recentOrders = [
    { id: "#1042", customer: "أحمد محمد", amount: 85000, status: "جديد", time: "منذ 5 دقائق" },
    { id: "#1041", customer: "سارة علي", amount: 120000, status: "قيد التوصيل", time: "منذ ساعة" },
    { id: "#1040", customer: "عمر حسين", amount: 45000, status: "مكتمل", time: "منذ 3 ساعات" },
    { id: "#1039", customer: "فاطمة كريم", amount: 210000, status: "مكتمل", time: "أمس" },
  ];

  const statusColor: Record<string, string> = {
    "جديد": "bg-primary/10 text-primary",
    "قيد التوصيل": "bg-accent/10 text-accent-foreground",
    "مكتمل": "bg-success/10 text-success",
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="container mx-auto px-4 pt-10 pb-6">
        <p className="text-sm text-muted-foreground">مرحباً بك 👋</p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">لوحة التحكم</h1>
      </div>

      <main className="container mx-auto px-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "الإيرادات", value: `${(stats.revenue / 1000).toLocaleString("ar-IQ")}K`, sub: "د.ع", change: stats.revenueChange, icon: DollarSign, color: "text-primary" },
            { label: "الطلبات", value: stats.orders, change: stats.ordersChange, icon: ShoppingCart, color: "text-accent-foreground" },
            { label: "العملاء", value: stats.customers, change: stats.customersChange, icon: Users, color: "text-success" },
            { label: "الزوار", value: stats.visitors, icon: Eye, color: "text-muted-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                {stat.change !== undefined && (
                  <span className={`text-[11px] font-medium flex items-center gap-0.5 ${stat.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {stat.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(stat.change)}%
                  </span>
                )}
              </div>
              <span className="text-xl font-bold text-foreground block">
                {stat.value}
                {stat.sub && <span className="text-[10px] text-muted-foreground mr-1">{stat.sub}</span>}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-4 pb-3">
            <h2 className="text-sm font-semibold text-foreground">آخر الطلبات</h2>
            <button onClick={() => navigate("/orders")} className="text-xs text-primary font-medium">عرض الكل</button>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{order.customer}</span>
                    <span className="text-[11px] text-muted-foreground">{order.id}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[order.status] || ""}`}>
                      {order.status}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      {order.time}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground whitespace-nowrap">
                  {order.amount.toLocaleString("ar-IQ")} <span className="text-[9px] text-muted-foreground">د.ع</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        {products.length > 0 && (
          <div className="bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between p-4 pb-3">
              <h2 className="text-sm font-semibold text-foreground">آخر المنتجات</h2>
              <button onClick={() => navigate("/inventory")} className="text-xs text-primary font-medium">عرض الكل</button>
            </div>
            <div className="divide-y divide-border">
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.category}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground whitespace-nowrap">
                    {(p.discount ? p.price - (p.price * p.discount) / 100 : p.price).toLocaleString("ar-IQ")}
                    <span className="text-[9px] text-muted-foreground mr-0.5">د.ع</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
