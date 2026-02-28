import { ShoppingCart, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";

const MOCK_ORDERS = [
  { id: "#1042", customer: "أحمد محمد", amount: 85000, status: "جديد", items: 2, date: "27 فبراير 2026" },
  { id: "#1041", customer: "سارة علي", amount: 120000, status: "قيد التوصيل", items: 3, date: "27 فبراير 2026" },
  { id: "#1040", customer: "عمر حسين", amount: 45000, status: "مكتمل", items: 1, date: "26 فبراير 2026" },
  { id: "#1039", customer: "فاطمة كريم", amount: 210000, status: "مكتمل", items: 4, date: "26 فبراير 2026" },
  { id: "#1038", customer: "حسن جاسم", amount: 67000, status: "ملغي", items: 1, date: "25 فبراير 2026" },
  { id: "#1037", customer: "نور الدين", amount: 155000, status: "مكتمل", items: 2, date: "25 فبراير 2026" },
];

const statusColor: Record<string, string> = {
  "جديد": "bg-primary/10 text-primary",
  "قيد التوصيل": "bg-accent/10 text-accent-foreground",
  "مكتمل": "bg-success/10 text-success",
  "ملغي": "bg-destructive/10 text-destructive",
};

const TABS = ["الكل", "جديد", "قيد التوصيل", "مكتمل", "ملغي"];

const Orders = () => {
  const [activeTab, setActiveTab] = useState("الكل");
  const [search, setSearch] = useState("");

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchTab = activeTab === "الكل" || o.status === activeTab;
    const matchSearch = !search || o.customer.includes(search) || o.id.includes(search);
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="الطلبات" subtitle={`${MOCK_ORDERS.length} طلب`} showBack={false} />

      <main className="container mx-auto px-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن طلب..." className="pr-10" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">لا توجد طلبات</p>
            </div>
          ) : (
            filtered.map((order) => (
              <div key={order.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{order.customer}</span>
                    <span className="text-[11px] text-muted-foreground">{order.id}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[order.status] || ""}`}>
                      {order.status}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{order.items} منتج</span>
                    <span className="text-[11px] text-muted-foreground">• {order.date}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground whitespace-nowrap">
                  {order.amount.toLocaleString("ar-IQ")} <span className="text-[9px] text-muted-foreground">د.ع</span>
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
