import { useState } from "react";
import { Plus, Search, Ticket, Copy, Trash2, Percent, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";

interface Coupon {
  id: string; code: string; type: "percentage" | "fixed"; value: number; minOrder: number; maxUses: number; usedCount: number; active: boolean; expiresAt: string;
}

const MOCK_COUPONS: Coupon[] = [
  { id: "1", code: "WELCOME10", type: "percentage", value: 10, minOrder: 25000, maxUses: 100, usedCount: 34, active: true, expiresAt: "2026-04-01" },
  { id: "2", code: "SAVE5K", type: "fixed", value: 5000, minOrder: 50000, maxUses: 50, usedCount: 12, active: true, expiresAt: "2026-03-15" },
  { id: "3", code: "SUMMER20", type: "percentage", value: 20, minOrder: 40000, maxUses: 200, usedCount: 200, active: false, expiresAt: "2026-02-28" },
];

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", type: "percentage" as "percentage" | "fixed", value: 0, minOrder: 0, maxUses: 100, expiresAt: "" });

  const filtered = coupons.filter((c) => !search || c.code.toLowerCase().includes(search.toLowerCase()));
  const toggleCoupon = (id: string) => setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  const deleteCoupon = (id: string) => setCoupons((prev) => prev.filter((c) => c.id !== id));
  const copyCode = (code: string) => { navigator.clipboard.writeText(code); toast({ title: "تم النسخ" }); };
  const addCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) return;
    setCoupons((prev) => [{ id: Date.now().toString(), ...newCoupon, usedCount: 0, active: true }, ...prev]);
    setNewCoupon({ code: "", type: "percentage", value: 0, minOrder: 0, maxUses: 100, expiresAt: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="أكواد الخصم" subtitle={`${coupons.length} كود`} actions={
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1.5"><Plus className="h-4 w-4" />إنشاء كود</Button>
      } />

      <main className="container mx-auto px-4 pt-4 space-y-4">
        {showForm && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-4 animate-slide-in">
            <h3 className="text-sm font-semibold text-foreground">كود خصم جديد</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">الكود</label>
                <Input value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="مثال: WELCOME10" className="uppercase" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">النوع</label>
                <div className="flex gap-2">
                  <button onClick={() => setNewCoupon({ ...newCoupon, type: "percentage" })} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium border transition-colors ${newCoupon.type === "percentage" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                    <Percent className="h-3 w-3" /> نسبة
                  </button>
                  <button onClick={() => setNewCoupon({ ...newCoupon, type: "fixed" })} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium border transition-colors ${newCoupon.type === "fixed" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                    <Hash className="h-3 w-3" /> مبلغ ثابت
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">القيمة {newCoupon.type === "percentage" ? "(%)" : "(د.ع)"}</label>
                <Input type="number" value={newCoupon.value || ""} onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">حد أدنى للطلب (د.ع)</label>
                <Input type="number" value={newCoupon.minOrder || ""} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">عدد الاستخدامات</label>
                <Input type="number" value={newCoupon.maxUses || ""} onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">تاريخ الانتهاء</label>
                <Input type="date" value={newCoupon.expiresAt} onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addCoupon} size="sm" className="flex-1">إنشاء</Button>
              <Button onClick={() => setShowForm(false)} variant="outline" size="sm">إلغاء</Button>
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن كود..." className="pr-10" />
        </div>

        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Ticket className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">لا توجد أكواد</p>
            </div>
          ) : (
            filtered.map((coupon) => (
              <div key={coupon.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${coupon.active ? "bg-primary/10" : "bg-muted"}`}>
                      <Ticket className={`h-4 w-4 ${coupon.active ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground font-mono">{coupon.code}</span>
                        <button onClick={() => copyCode(coupon.code)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {coupon.type === "percentage" ? `${coupon.value}% خصم` : `${coupon.value.toLocaleString("ar-IQ")} د.ع خصم`}
                        {coupon.minOrder > 0 && ` • حد أدنى ${coupon.minOrder.toLocaleString("ar-IQ")}`}
                      </span>
                    </div>
                  </div>
                  <Switch checked={coupon.active} onCheckedChange={() => toggleCoupon(coupon.id)} />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>استخدام {coupon.usedCount}/{coupon.maxUses}</span>
                    <span>ينتهي {coupon.expiresAt}</span>
                  </div>
                  <button onClick={() => deleteCoupon(coupon.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Coupons;
