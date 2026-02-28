import { ShoppingCart, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/hooks/useLanguage";
import OrderDetailDialog from "@/components/OrderDetailDialog";
import StoreSwitcher from "@/components/StoreSwitcher";

const MOCK_ORDERS = [
  { id: "#1042", customer: "أحمد محمد", amount: 85000, status_ar: "جديد", status_ku: "نوێ", items: 2, date: "27 فبراير 2026" },
  { id: "#1041", customer: "سارة علي", amount: 120000, status_ar: "قيد التوصيل", status_ku: "لە گەیاندندا", items: 3, date: "27 فبراير 2026" },
  { id: "#1040", customer: "عمر حسين", amount: 45000, status_ar: "مكتمل", status_ku: "تەواوبوو", items: 1, date: "26 فبراير 2026" },
  { id: "#1039", customer: "فاطمة كريم", amount: 210000, status_ar: "مكتمل", status_ku: "تەواوبوو", items: 4, date: "26 فبراير 2026" },
  { id: "#1038", customer: "حسن جاسم", amount: 67000, status_ar: "ملغي", status_ku: "هەڵوەشێنراوە", items: 1, date: "25 فبراير 2026" },
  { id: "#1037", customer: "نور الدين", amount: 155000, status_ar: "مكتمل", status_ku: "تەواوبوو", items: 2, date: "25 فبراير 2026" },
];

const Orders = () => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState(t.all);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const statusColor: Record<string, string> = {
    "جديد": "bg-primary/10 text-primary", "نوێ": "bg-primary/10 text-primary",
    "قيد التوصيل": "bg-accent/10 text-accent-foreground", "لە گەیاندندا": "bg-accent/10 text-accent-foreground",
    "مكتمل": "bg-success/10 text-success", "تەواوبوو": "bg-success/10 text-success",
    "ملغي": "bg-destructive/10 text-destructive", "هەڵوەشێنراوە": "bg-destructive/10 text-destructive",
  };

  const TABS = [t.all, t.orders.new, t.orders.delivering, t.orders.completed, t.orders.cancelled];

  const filtered = MOCK_ORDERS.filter((o) => {
    const status = lang === "ku" ? o.status_ku : o.status_ar;
    const matchTab = activeTab === t.all || status === activeTab;
    const matchSearch = !search || o.customer.includes(search) || o.id.includes(search);
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={t.orders.title} subtitle={`${MOCK_ORDERS.length} ${t.orders.order}`} showBack={false} actions={<StoreSwitcher compact />} />
      <main className="container mx-auto px-4 space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.orders.searchPlaceholder} className="pr-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{tab}</button>
          ))}
        </div>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">{t.orders.noOrders}</p>
            </div>
          ) : (
            filtered.map((order) => {
              const status = lang === "ku" ? order.status_ku : order.status_ar;
              return (
                <div key={order.id} onClick={() => { setSelectedOrder(order); setDetailOpen(true); }} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{order.customer}</span>
                      <span className="text-[11px] text-muted-foreground">{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[status] || ""}`}>{status}</span>
                      <span className="text-[11px] text-muted-foreground">{order.items} {t.orders.product}</span>
                      <span className="text-[11px] text-muted-foreground">• {order.date}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground whitespace-nowrap">{order.amount.toLocaleString("ar-IQ")} <span className="text-[9px] text-muted-foreground">{t.currency}</span></span>
                </div>
              );
            })
          )}
        </div>
      </main>
      <OrderDetailDialog order={selectedOrder} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
};

export default Orders;
