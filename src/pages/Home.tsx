import { useState } from "react";
import { 
  TrendingUp, TrendingDown, ShoppingCart, Users, Package, Store, 
  DollarSign, Clock, Eye, Bell, ExternalLink, ChevronDown,
  LogOut, Settings, User, CreditCard, Plus, X, Sparkles,
  BarChart3, Box
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import SalesChart from "@/components/SalesChart";
import { useStores } from "@/hooks/useStores";
import { useSearchParams } from "react-router-dom";

const NOTIFICATIONS_AR = [
  { id: "1", text: "طلب جديد #1042 من أحمد محمد", time: "منذ 5 دقائق", read: false },
  { id: "2", text: "تم اكتمال توصيل الطلب #1038", time: "منذ ساعة", read: false },
  { id: "3", text: "منتج 'قميص بولو' نفد من المخزون", time: "منذ 3 ساعات", read: true },
  { id: "4", text: "عميل جديد سجّل في المتجر", time: "أمس", read: true },
];

const NOTIFICATIONS_KU = [
  { id: "1", text: "داواکاری نوێ #1042 لە ئەحمەد محەمەد", time: "پێش ٥ خولەک", read: false },
  { id: "2", text: "گەیاندنی داواکاری #1038 تەواوبوو", time: "پێش کاتژمێرێک", read: false },
  { id: "3", text: "بەرهەمی 'قەمیسی پۆلۆ' تەواوبوو لە کۆگا", time: "پێش ٣ کاتژمێر", read: true },
  { id: "4", text: "کڕیارێکی نوێ تۆمارکرا لە فرۆشگا", time: "دوێنێ", read: true },
];

const Home = () => {
  const { products } = useInventory();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { stores, activeStoreId, setActiveStoreId } = useStores();
  const activeStore = stores.find((s) => s.id === activeStoreId);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [notifications, setNotifications] = useState(lang === "ku" ? NOTIFICATIONS_KU : NOTIFICATIONS_AR);
	const [searchParams, setSearchParams] = useSearchParams();

  const showProductReminder = products.length <= 1;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const totalValue = products.reduce((sum, p) => {
    const final = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
    return sum + final;
  }, 0);

  const stats = {
    revenue: 2450000, revenueChange: 12.5,
    orders: 48, ordersChange: 8.3,
    customers: 156, customersChange: -2.1,
    products: products.length, visitors: 1240,
  };

  const recentOrders = [
    { id: "#1042", customer: "أحمد محمد", amount: 85000, status: lang === "ku" ? "نوێ" : "جديد", time: lang === "ku" ? "پێش ٥ خولەک" : "منذ 5 دقائق" },
    { id: "#1041", customer: "سارة علي", amount: 120000, status: lang === "ku" ? "لە گەیاندندا" : "قيد التوصيل", time: lang === "ku" ? "پێش کاتژمێرێک" : "منذ ساعة" },
    { id: "#1040", customer: "عمر حسين", amount: 45000, status: lang === "ku" ? "تەواوبوو" : "مكتمل", time: lang === "ku" ? "پێش ٣ کاتژمێر" : "منذ 3 ساعات" },
    { id: "#1039", customer: "فاطمة كريم", amount: 210000, status: lang === "ku" ? "تەواوبوو" : "مكتمل", time: lang === "ku" ? "دوێنێ" : "أمس" },
  ];

  const statusColor: Record<string, string> = {
    "جديد": "bg-primary/10 text-primary", "نوێ": "bg-primary/10 text-primary",
    "قيد التوصيل": "bg-accent/10 text-accent-foreground", "لە گەیاندندا": "bg-accent/10 text-accent-foreground",
    "مكتمل": "bg-success/10 text-success", "تەواوبوو": "bg-success/10 text-success",
  };

	const switchStore = (storeId: string) => {
		setActiveStoreId(storeId);
		setSearchParams({ storeId });
	};

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowAccountMenu(!showAccountMenu); setShowNotifications(false); }} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">أ</button>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">{t.home.dashboard}</h1>
              {stores.length > 1 ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <Store className="h-2.5 w-2.5 text-primary" />
                  <select
                    value={activeStoreId}
                    onChange={(e) => switchStore(e.target.value)}
                    className="bg-transparent text-[10px] font-medium text-muted-foreground outline-none border-none cursor-pointer appearance-none"
                  >
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="h-2.5 w-2.5 text-muted-foreground" />
                </div>
              ) : (
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{t.home.welcome}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => window.open(`https://${activeStore?.domain || "mystore"}.matager.store`, "_blank")}
              className="h-8 px-3 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-1.5 hover:bg-primary/15 transition-colors"
            >
              <ExternalLink className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-semibold text-primary">{t.home.openStore}</span>
            </button>
            <div className="relative">
              <button onClick={() => { setShowNotifications(!showNotifications); setShowAccountMenu(false); }} className="relative w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Bell className="h-3.5 w-3.5 text-foreground" />
                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-destructive text-destructive-foreground text-[8px] font-bold flex items-center justify-center">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                  <div className="absolute top-full mt-2 left-0 z-40 w-72 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <span className="text-sm font-semibold text-foreground">{t.home.notifications}</span>
                      {unreadCount > 0 && <button onClick={markAllRead} className="text-[11px] text-primary font-medium">{t.home.readAll}</button>}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-border">
                      {notifications.map((n) => (
                        <div key={n.id} className={`px-4 py-3 ${!n.read ? "bg-primary/5" : ""}`}>
                          <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Account Menu Dropdown */}
        {showAccountMenu && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowAccountMenu(false)} />
            <div className="absolute top-14 right-4 z-40 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">أحمد التاجر</p>
                <p className="text-[11px] text-muted-foreground">ahmed@example.com</p>
              </div>
              <div className="py-1">
                {[
                  { icon: User, label: t.home.myAccount, path: "/profile" },
                  { icon: CreditCard, label: t.home.planAndSub, path: "/plans" },
                  { icon: Settings, label: t.home.settings, path: "/profile" },
                ].map((item) => (
                  <button key={item.label} onClick={() => { navigate(item.path); setShowAccountMenu(false); }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <item.icon className="h-4 w-4 text-muted-foreground" />{item.label}
                  </button>
                ))}
                <div className="border-t border-border mt-1 pt-1">
                  <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors">
                    <LogOut className="h-4 w-4" />{t.home.logout}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <main className="container mx-auto px-4 pt-4 space-y-4">

        {showProductReminder && (
          <div className="relative bg-gradient-to-l from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground">{t.home.addFirstProduct}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{t.home.addFirstProductDesc}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Button onClick={() => navigate("/add")} size="sm" className="h-8 rounded-lg text-xs gap-1.5">
                    <Plus className="h-3.5 w-3.5" />{t.home.addProductNow}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => navigate("/plans")} className="w-full bg-gradient-to-l from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-3.5 flex items-center justify-between hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><CreditCard className="h-4 w-4 text-primary" /></div>
            <div className="text-right">
              <p className="text-xs font-bold text-foreground">{t.home.basicPlan}</p>
              <p className="text-[10px] text-muted-foreground">{t.home.upgradeCta}</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90" />
        </button>

        {/* Weekly Revenue + Chart Combined */}
        <div className="bg-gradient-to-l from-primary/15 via-primary/8 to-primary/3 border border-primary/20 rounded-2xl overflow-hidden">
          <div className="p-5 pb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{lang === "ku" ? "داهاتی ئەم هەفتە" : "إيرادات هذا الأسبوع"}</span>
              </div>
              <span className={`text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-full ${stats.revenueChange >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {stats.revenueChange >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {stats.revenueChange >= 0 ? "+" : ""}{stats.revenueChange}%
              </span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-foreground">{stats.revenue.toLocaleString("ar-IQ")}</span>
              <span className="text-sm text-muted-foreground mr-1.5">{t.currency}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{lang === "ku" ? "بەراورد بە هەفتەی ڕابردوو" : "مقارنة بالأسبوع الماضي"}</p>
          </div>
          <SalesChart embedded />
        </div>

        {/* Stats Grid - 3 columns */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: t.home.orders, value: stats.orders, change: stats.ordersChange, icon: ShoppingCart, color: "text-accent-foreground" },
            { label: t.home.customers, value: stats.customers, change: stats.customersChange, icon: Users, color: "text-success" },
            { label: t.home.visitors, value: stats.visitors, icon: Eye, color: "text-muted-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                {stat.change !== undefined && (
                  <span className={`text-[10px] font-medium flex items-center gap-0.5 ${stat.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {stat.change >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}{Math.abs(stat.change)}%
                  </span>
                )}
              </div>
              <span className="text-lg font-bold text-foreground block">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: lang === "ku" ? "بەرهەمی نوێ" : "إضافة منتج", icon: Plus, path: "/add", bg: "bg-primary/10", iconColor: "text-primary" },
            { label: lang === "ku" ? "شیکاری" : "التحليلات", icon: BarChart3, path: "/stats", bg: "bg-accent/10", iconColor: "text-accent-foreground" },
            { label: lang === "ku" ? "داواکارییەکان" : "الطلبات", icon: ShoppingCart, path: "/orders", bg: "bg-success/10", iconColor: "text-success" },
            { label: lang === "ku" ? "بەرهەمەکان" : "المنتجات", icon: Box, path: "/inventory", bg: "bg-muted", iconColor: "text-muted-foreground" },
          ].map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 bg-card border border-border rounded-xl p-3.5 hover:bg-muted/50 transition-colors active:scale-95"
            >
              <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center`}>
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <span className="text-[11px] font-semibold text-foreground leading-tight text-center">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-4 pb-3">
            <h2 className="text-sm font-semibold text-foreground">{t.home.recentOrders}</h2>
            <button onClick={() => navigate("/orders")} className="text-xs text-primary font-medium">{t.home.viewAll}</button>
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
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[order.status] || ""}`}>{order.status}</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{order.time}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground whitespace-nowrap">{order.amount.toLocaleString("ar-IQ")} <span className="text-[9px] text-muted-foreground">{t.currency}</span></span>
              </div>
            ))}
          </div>
        </div>

        {products.length > 0 && (
          <div className="bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between p-4 pb-3">
              <h2 className="text-sm font-semibold text-foreground">{t.home.recentProducts}</h2>
              <button onClick={() => navigate("/inventory")} className="text-xs text-primary font-medium">{t.home.viewAll}</button>
            </div>
            <div className="divide-y divide-border">
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {p.images.length > 0 ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package className="h-4 w-4" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.category}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground whitespace-nowrap">
                    {(p.discount ? p.price - (p.price * p.discount) / 100 : p.price).toLocaleString("ar-IQ")}
                    <span className="text-[9px] text-muted-foreground mr-0.5">{t.currency}</span>
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
