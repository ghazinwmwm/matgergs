import { useState } from "react";
import { Plus, Store, Settings, Users, Trash2, Globe, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProGate } from "@/components/ProGate";
import { usePlan } from "@/hooks/usePlan";

interface StoreItem {
  id: string;
  name: string;
  domain: string;
  location: string;
  products: number;
  orders: number;
  managers: number;
  active: boolean;
}

const MOCK_STORES: StoreItem[] = [
  { id: "1", name: "المتجر الرئيسي", domain: "mystore.matager.store", location: "بغداد", products: 45, orders: 120, managers: 2, active: true },
  { id: "2", name: "فرع المنصور", domain: "mansour.matager.store", location: "المنصور - بغداد", products: 28, orders: 67, managers: 1, active: true },
];

const Stores = () => {
  const { isPro } = usePlan();
  const [stores, setStores] = useState<StoreItem[]>(MOCK_STORES);
  const [showForm, setShowForm] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", domain: "", location: "" });

  const addStore = () => {
    if (!newStore.name) return;
    const store: StoreItem = {
      id: Date.now().toString(),
      name: newStore.name,
      domain: newStore.domain || `${newStore.name.replace(/\s/g, "")}.matager.store`,
      location: newStore.location,
      products: 0, orders: 0, managers: 1, active: true,
    };
    setStores((prev) => [store, ...prev]);
    setNewStore({ name: "", domain: "", location: "" });
    setShowForm(false);
  };

  const deleteStore = (id: string) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  // Show first store always, gate adding more stores
  const firstStore = stores[0];
  const additionalStores = stores.slice(1);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-10 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">المتاجر</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{stores.length} متجر</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            متجر جديد
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 space-y-4">
        {showForm && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-slide-in">
            <h3 className="text-sm font-semibold text-foreground">إنشاء متجر جديد</h3>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">اسم المتجر</label>
              <Input value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} placeholder="اسم المتجر" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">الدومين</label>
              <Input value={newStore.domain} onChange={(e) => setNewStore({ ...newStore, domain: e.target.value })} placeholder="store.matager.store" dir="ltr" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">الموقع</label>
              <Input value={newStore.location} onChange={(e) => setNewStore({ ...newStore, location: e.target.value })} placeholder="بغداد" />
            </div>
            <div className="flex gap-2">
              <Button onClick={addStore} size="sm" className="flex-1">إنشاء</Button>
              <Button onClick={() => setShowForm(false)} variant="outline" size="sm">إلغاء</Button>
            </div>
          </div>
        )}

        {/* First store - always visible */}
        {firstStore && (
          <StoreCard store={firstStore} canDelete={false} onDelete={deleteStore} />
        )}

        {/* Additional stores - PRO gated */}
        {additionalStores.length > 0 && (
          <ProGate feature="إضافة متاجر متعددة">
            <div className="space-y-3">
              {additionalStores.map((store) => (
                <StoreCard key={store.id} store={store} canDelete onDelete={deleteStore} />
              ))}
            </div>
          </ProGate>
        )}
      </main>
    </div>
  );
};

const StoreCard = ({ store, canDelete, onDelete }: { store: StoreItem; canDelete: boolean; onDelete: (id: string) => void }) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <div className="flex items-start gap-3">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Store className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">{store.name}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${store.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
            {store.active ? "نشط" : "متوقف"}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Globe className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground" dir="ltr">{store.domain}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">{store.location}</span>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
      <div className="text-center">
        <span className="text-sm font-bold text-foreground block">{store.products}</span>
        <span className="text-[10px] text-muted-foreground">منتج</span>
      </div>
      <div className="text-center">
        <span className="text-sm font-bold text-foreground block">{store.orders}</span>
        <span className="text-[10px] text-muted-foreground">طلب</span>
      </div>
      <div className="text-center">
        <span className="text-sm font-bold text-foreground block">{store.managers}</span>
        <span className="text-[10px] text-muted-foreground">مدير</span>
      </div>
    </div>
    <div className="flex gap-2 mt-3">
      <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs"><Settings className="h-3 w-3" /> إعدادات</Button>
      <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs"><Users className="h-3 w-3" /> المديرين</Button>
      {canDelete && (
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive gap-1 text-xs" onClick={() => onDelete(store.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  </div>
);

export default Stores;
