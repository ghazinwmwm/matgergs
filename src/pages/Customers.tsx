import { Users, Search, ShoppingCart, TrendingUp, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/hooks/useLanguage";

interface Customer {
  id: string;
  name: string;
  phone: string;
  orders: number;
  total: number;
  lastOrder: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: "c1", name: "أحمد محمد", phone: "0770 123 4567", orders: 12, total: 1450000, lastOrder: "27 فبراير 2026" },
  { id: "c2", name: "سارة علي", phone: "0771 234 5678", orders: 8, total: 920000, lastOrder: "27 فبراير 2026" },
  { id: "c3", name: "عمر حسين", phone: "0772 345 6789", orders: 5, total: 380000, lastOrder: "26 فبراير 2026" },
  { id: "c4", name: "فاطمة كريم", phone: "0773 456 7890", orders: 15, total: 2100000, lastOrder: "26 فبراير 2026" },
  { id: "c5", name: "حسن جاسم", phone: "0774 567 8901", orders: 3, total: 210000, lastOrder: "25 فبراير 2026" },
];

const Customers = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const filtered = MOCK_CUSTOMERS.filter((c) => !search || c.name.includes(search) || c.phone.includes(search));

  const topBuyer = MOCK_CUSTOMERS.reduce((a, b) => (a.total > b.total ? a : b));
  const totalSpent = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={t.customers.title} subtitle={`${MOCK_CUSTOMERS.length} ${t.customers.customer}`} showBack={false} />
      <main className="container mx-auto px-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <Users className="h-4 w-4 text-primary mx-auto mb-1" />
            <span className="text-lg font-bold text-foreground block">{MOCK_CUSTOMERS.length}</span>
            <span className="text-[10px] text-muted-foreground">{t.customers.title}</span>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <Crown className="h-4 w-4 text-accent mx-auto mb-1" />
            <span className="text-xs font-bold text-foreground block truncate">{topBuyer.name}</span>
            <span className="text-[10px] text-muted-foreground">{t.customers.topBuyer}</span>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <TrendingUp className="h-4 w-4 text-success mx-auto mb-1" />
            <span className="text-xs font-bold text-foreground block">{(totalSpent / 1000000).toFixed(1)}M</span>
            <span className="text-[10px] text-muted-foreground">{t.customers.totalSpent}</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.customers.searchPlaceholder} className="pr-10" />
        </div>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Users className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">{t.customers.noCustomers}</p>
            </div>
          ) : (
            filtered.map((customer) => (
              <div key={customer.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{customer.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{customer.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{customer.phone}</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                      <ShoppingCart className="h-2.5 w-2.5" />{customer.orders} {t.orders.order}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-foreground block">{customer.total.toLocaleString("ar-IQ")}</span>
                  <span className="text-[10px] text-muted-foreground">{t.currency}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Customers;
