import { useState } from "react";
import { Truck, Plus, Trash2, Settings, Globe, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/PageHeader";

interface DeliveryCompany {
  id: string; name: string; logo: string; areas: string[]; baseFee: number; perKm: number; estimatedDays: string; active: boolean; phone: string;
}

const MOCK_COMPANIES: DeliveryCompany[] = [
  { id: "1", name: "بريد العراق السريع", logo: "🚚", areas: ["بغداد", "البصرة", "أربيل"], baseFee: 5000, perKm: 500, estimatedDays: "1-3 أيام", active: true, phone: "0770 000 0001" },
  { id: "2", name: "توصيل بلس", logo: "📦", areas: ["بغداد", "النجف", "كربلاء"], baseFee: 3000, perKm: 350, estimatedDays: "1-2 يوم", active: true, phone: "0771 000 0002" },
  { id: "3", name: "سريع للتوصيل", logo: "⚡", areas: ["بغداد فقط"], baseFee: 2000, perKm: 0, estimatedDays: "نفس اليوم", active: false, phone: "0772 000 0003" },
];

const Delivery = () => {
  const [companies, setCompanies] = useState<DeliveryCompany[]>(MOCK_COMPANIES);
  const [showForm, setShowForm] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", baseFee: 0, phone: "", estimatedDays: "" });

  const toggleCompany = (id: string) => setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  const addCompany = () => {
    if (!newCompany.name) return;
    const company: DeliveryCompany = { id: Date.now().toString(), name: newCompany.name, logo: "🚚", areas: [], baseFee: newCompany.baseFee, perKm: 0, estimatedDays: newCompany.estimatedDays || "2-3 أيام", active: true, phone: newCompany.phone };
    setCompanies((prev) => [company, ...prev]);
    setNewCompany({ name: "", baseFee: 0, phone: "", estimatedDays: "" });
    setShowForm(false);
  };
  const deleteCompany = (id: string) => setCompanies((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="شركات التوصيل"
        subtitle={`${companies.length} شركة`}
        actions={
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            إضافة شركة
          </Button>
        }
      />

      <main className="container mx-auto px-4 space-y-4">
        {showForm && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-slide-in">
            <h3 className="text-sm font-semibold text-foreground">إضافة شركة توصيل</h3>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">اسم الشركة</label>
              <Input value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} placeholder="اسم شركة التوصيل" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">رسوم التوصيل (د.ع)</label>
                <Input type="number" value={newCompany.baseFee || ""} onChange={(e) => setNewCompany({ ...newCompany, baseFee: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">مدة التوصيل</label>
                <Input value={newCompany.estimatedDays} onChange={(e) => setNewCompany({ ...newCompany, estimatedDays: e.target.value })} placeholder="1-3 أيام" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">رقم الهاتف</label>
              <Input value={newCompany.phone} onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })} placeholder="07XX XXX XXXX" dir="ltr" />
            </div>
            <div className="flex gap-2">
              <Button onClick={addCompany} size="sm" className="flex-1">إضافة</Button>
              <Button onClick={() => setShowForm(false)} variant="outline" size="sm">إلغاء</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {companies.map((company) => (
            <div key={company.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                    {company.logo}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{company.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                        <Truck className="h-3 w-3" /> {company.estimatedDays}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                        <Phone className="h-3 w-3" /> {company.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <Switch checked={company.active} onCheckedChange={() => toggleCompany(company.id)} />
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex flex-wrap gap-1">
                  {company.areas.map((area) => (
                    <span key={area} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {area}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">{company.baseFee.toLocaleString("ar-IQ")} د.ع</span>
                  <button onClick={() => deleteCompany(company.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Delivery;
