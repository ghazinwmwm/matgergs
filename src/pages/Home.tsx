import { Package, TrendingUp, ShoppingBag, Layers, ArrowUpLeft, ArrowDownLeft, Clock } from "lucide-react";
import { useInventory } from "./Index";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { products } = useInventory();
  const navigate = useNavigate();

  const totalValue = products.reduce((sum, p) => {
    const final = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
    return sum + final;
  }, 0);

  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const discounted = products.filter((p) => p.discount > 0).length;
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero Glass Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />
        <div className="relative container mx-auto px-4 pt-12 pb-8">
          <p className="text-sm text-muted-foreground mb-1">مرحباً بك 👋</p>
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground mt-1">نظرة عامة على متجرك</p>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-2 space-y-5">
        {/* Glass Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-0.5 text-[11px] text-success font-medium">
                <ArrowUpLeft className="h-3 w-3" />
                {products.length}
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground block">{products.length}</span>
            <span className="text-xs text-muted-foreground">إجمالي المنتجات</span>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
            </div>
            <span className="text-lg font-bold text-foreground block leading-tight">
              {totalValue.toLocaleString("ar-IQ")}
              <span className="text-[10px] text-muted-foreground mr-1">د.ع</span>
            </span>
            <span className="text-xs text-muted-foreground">القيمة الإجمالية</span>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
                <Layers className="h-4 w-4 text-success" />
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground block">{Object.keys(categoryCounts).length}</span>
            <span className="text-xs text-muted-foreground">الأصناف</span>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-destructive" />
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground block">{discounted}</span>
            <span className="text-xs text-muted-foreground">منتجات بخصم</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">إجراءات سريعة</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => navigate("/add")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[11px] font-medium text-foreground">إضافة منتج</span>
            </button>
            <button
              onClick={() => navigate("/inventory")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Layers className="h-5 w-5 text-accent" />
              </div>
              <span className="text-[11px] font-medium text-foreground">المخزون</span>
            </button>
            <button
              onClick={() => navigate("/stats")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-success/5 hover:bg-success/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <span className="text-[11px] font-medium text-foreground">الإحصائيات</span>
            </button>
          </div>
        </div>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <div className="glass-card rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">أعلى الأصناف</h2>
            <div className="space-y-2.5">
              {topCategories.map(([cat, count]) => {
                const pct = Math.round((count / products.length) * 100);
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{cat}</span>
                      <span className="text-xs text-muted-foreground">{count} منتج</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Products */}
        {products.length > 0 && (
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">آخر المنتجات</h2>
              <button onClick={() => navigate("/inventory")} className="text-xs text-primary font-medium">عرض الكل</button>
            </div>
            <div className="space-y-2.5">
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-muted overflow-hidden flex-shrink-0">
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
                  <span className="text-sm font-bold text-primary whitespace-nowrap">
                    {(p.discount ? p.price - (p.price * p.discount) / 100 : p.price).toLocaleString("ar-IQ")}
                    <span className="text-[9px] mr-0.5">د.ع</span>
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
