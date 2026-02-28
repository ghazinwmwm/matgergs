import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Store, Globe, MapPin, ShoppingCart, Package, Users, TrendingUp,
  ExternalLink, Settings, Trash2, ToggleLeft, ToggleRight, ChevronLeft,
  Eye, MessageCircle, Instagram, Facebook, ShoppingBag, Calendar,
  DollarSign, BarChart3, Edit2, X, Image, FileText, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProGate } from "@/components/ProGate";
import { usePlan } from "@/hooks/usePlan";
import { useStores, type StoreItem } from "@/hooks/useStores";
import { useLanguage } from "@/hooks/useLanguage";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/hooks/use-toast";

const STORE_CATEGORIES = [
  "ملابس وأزياء", "إلكترونيات", "مواد غذائية", "مستحضرات تجميل",
  "أحذية وحقائب", "أثاث ومفروشات", "هدايا وتحف", "أخرى"
];

type View = "list" | "detail" | "add";

const Stores = () => {
  const navigate = useNavigate();
  const { isPro } = usePlan();
  const { stores, activeStoreId, setActiveStoreId, addStore, deleteStore, toggleStoreActive } = useStores();
  const { t, lang } = useLanguage();
  const [view, setView] = useState<View>("list");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Add store form
  const [formData, setFormData] = useState({
    name: "", slug: "", description: "", category: "", location: "",
    whatsapp: "", logo: null as string | null,
    socialLinks: {} as Record<string, string>,
  });

  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  const openDetail = (store: StoreItem) => {
    setSelectedStoreId(store.id);
    setView("detail");
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, logo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", category: "", location: "", whatsapp: "", logo: null, socialLinks: {} });
  };

  const handleAddStore = () => {
    if (!formData.name || !formData.whatsapp) {
      toast({ title: lang === "ku" ? "تکایە خانە پێویستەکان پڕبکەوە" : "يرجى ملء الحقول المطلوبة", variant: "destructive" });
      return;
    }
    addStore({
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
      domain: `${formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}.matager.store`,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      logo: formData.logo,
      whatsapp: formData.whatsapp,
      socialLinks: formData.socialLinks,
    });
    toast({ title: lang === "ku" ? "🎉 فرۆشگا بەسەرکەوتوویی دروستکرا!" : "🎉 تم إنشاء المتجر بنجاح!" });
    resetForm();
    setView("list");
  };

  // ─── ADD STORE VIEW ───
  if (view === "add") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <PageHeader
          title={lang === "ku" ? "فرۆشگای نوێ" : "متجر جديد"}
          subtitle={lang === "ku" ? "زانیاری فرۆشگا پڕبکەوە" : "أكمل بيانات المتجر"}
          showBack
          onBack={() => { resetForm(); setView("list"); }}
        />
        <main className="container mx-auto px-4 py-4 space-y-5">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="store-logo" className="cursor-pointer group">
              <div className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all overflow-hidden ${formData.logo ? "border-primary" : "border-border group-hover:border-primary/50"}`}>
                {formData.logo ? (
                  <img src={formData.logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Image className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[9px] text-muted-foreground">{lang === "ku" ? "لۆگۆ" : "الشعار"}</span>
                  </div>
                )}
              </div>
            </label>
            <input id="store-logo" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              {lang === "ku" ? "ناوی فرۆشگا *" : "اسم المتجر *"}
            </label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
                }));
              }}
              placeholder={lang === "ku" ? "نموونە: فرۆشگای شیک" : "مثال: متجر الأناقة"}
              className="h-11"
            />
          </div>

          {/* Domain preview */}
          {formData.name && (
            <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground" dir="ltr">
                {formData.slug || "your-store"}.matager.store
              </span>
            </div>
          )}

          {/* Subdomain */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              <Globe className="h-3.5 w-3.5 inline-block ml-1" />
              {lang === "ku" ? "دۆمەینی فرۆشگا *" : "نطاق المتجر *"}
            </label>
            <div className="flex items-center gap-0 border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring">
              <span className="text-[11px] text-muted-foreground bg-secondary px-3 py-2.5 border-l border-input whitespace-nowrap" dir="ltr">.matager.store</span>
              <input
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                placeholder="your-store"
                className="flex-1 h-11 px-3 text-xs bg-background text-foreground placeholder:text-muted-foreground outline-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              <MessageCircle className="h-3.5 w-3.5 inline-block ml-1 text-green-500" />
              {lang === "ku" ? "ژمارەی واتسئاپ *" : "رقم الواتساب *"}
            </label>
            <Input value={formData.whatsapp} onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))} placeholder="07XX XXX XXXX" className="h-11 text-xs" dir="ltr" type="tel" />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              <MapPin className="h-3.5 w-3.5 inline-block ml-1" />
              {lang === "ku" ? "شوێن" : "الموقع"}
            </label>
            <Input value={formData.location} onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))} placeholder={lang === "ku" ? "بەغدا" : "بغداد"} className="h-11" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              <FileText className="h-3.5 w-3.5 inline-block ml-1" />
              {lang === "ku" ? "وەسفی فرۆشگا" : "وصف المتجر"}
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder={lang === "ku" ? "وەسفێکی کورت دەربارەی فرۆشگاکەت..." : "اكتب وصفاً مختصراً عن متجرك..."}
              className="min-h-[80px] resize-none text-sm"
              maxLength={200}
            />
            <p className="text-[10px] text-muted-foreground mt-1 text-left" dir="ltr">{formData.description.length}/200</p>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">{lang === "ku" ? "جۆری فرۆشگا" : "تصنيف المتجر"}</label>
            <div className="grid grid-cols-2 gap-2">
              {STORE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${formData.category === cat ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/30"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button onClick={handleAddStore} className="w-full h-12 rounded-xl text-sm font-bold gap-2">
            <Store className="h-4 w-4" />
            {lang === "ku" ? "دروستکردنی فرۆشگا" : "إنشاء المتجر"}
          </Button>
        </main>
      </div>
    );
  }

  // ─── STORE DETAIL VIEW ───
  if (view === "detail" && selectedStore) {
    const socialEntries = Object.entries(selectedStore.socialLinks).filter(([, v]) => v);
    return (
      <div className="min-h-screen bg-background pb-24">
        <PageHeader
          title={selectedStore.name}
          subtitle={selectedStore.active ? (lang === "ku" ? "چالاک" : "نشط") : (lang === "ku" ? "ناچالاک" : "متوقف")}
          showBack
          onBack={() => setView("list")}
          actions={
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(`https://${selectedStore.domain}`, "_blank")}>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          }
        />
        <main className="container mx-auto px-4 py-4 space-y-4">
          {/* Store identity card */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {selectedStore.logo ? (
                  <img src={selectedStore.logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Store className="h-7 w-7 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-foreground">{selectedStore.name}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] text-primary" dir="ltr">{selectedStore.domain}</span>
                </div>
                {selectedStore.location && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{selectedStore.location}</span>
                  </div>
                )}
              </div>
            </div>
            {selectedStore.description && (
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed border-t border-border pt-3">
                {selectedStore.description}
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: lang === "ku" ? "بەرهەمەکان" : "المنتجات", value: selectedStore.products, icon: Package, color: "text-primary" },
              { label: lang === "ku" ? "داواکاریەکان" : "الطلبات", value: selectedStore.orders, icon: ShoppingCart, color: "text-accent-foreground" },
              { label: lang === "ku" ? "داهات" : "الإيرادات", value: `${(selectedStore.revenue / 1000).toLocaleString("ar-IQ")}K`, icon: DollarSign, color: "text-success", sub: t.currency },
              { label: lang === "ku" ? "بەڕێوەبەران" : "المديرين", value: selectedStore.managers, icon: Users, color: "text-muted-foreground" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-3.5">
                <stat.icon className={`h-4 w-4 ${stat.color} mb-1.5`} />
                <span className="text-lg font-bold text-foreground block">
                  {stat.value}
                  {stat.sub && <span className="text-[10px] text-muted-foreground mr-1">{stat.sub}</span>}
                </span>
                <span className="text-[11px] text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Info section */}
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{lang === "ku" ? "جۆر" : "التصنيف"}</span>
              <span className="text-xs font-medium text-foreground">{selectedStore.category || "—"}</span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{lang === "ku" ? "واتسئاپ" : "واتساب"}</span>
              <span className="text-xs font-medium text-foreground" dir="ltr">{selectedStore.whatsapp || "—"}</span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{lang === "ku" ? "بەرواری دروستکردن" : "تاريخ الإنشاء"}</span>
              <span className="text-xs font-medium text-foreground">{selectedStore.createdAt}</span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{lang === "ku" ? "دۆخ" : "الحالة"}</span>
              <button
                onClick={() => toggleStoreActive(selectedStore.id)}
                className={`flex items-center gap-1.5 text-xs font-medium ${selectedStore.active ? "text-success" : "text-muted-foreground"}`}
              >
                {selectedStore.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                {selectedStore.active ? (lang === "ku" ? "چالاک" : "نشط") : (lang === "ku" ? "ناچالاک" : "متوقف")}
              </button>
            </div>
          </div>

          {/* Social links */}
          {socialEntries.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3">
                {lang === "ku" ? "لینکەکانی تۆڕی کۆمەڵایەتی" : "روابط التواصل"}
              </h3>
              <div className="space-y-2.5">
                {socialEntries.map(([key, url]) => {
                  const iconMap: Record<string, typeof Instagram> = { instagram: Instagram, facebook: Facebook, tiktok: ShoppingBag, website: Globe };
                  const Icon = iconMap[key] || Globe;
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-xs text-primary hover:underline">
                      <Icon className="h-3.5 w-3.5" />
                      <span dir="ltr" className="truncate">{url}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2 h-11" onClick={() => navigate(`/stores/${selectedStore.id}/settings`)}>
              <Settings className="h-4 w-4" />
              {lang === "ku" ? "ڕێکخستنەکان" : "الإعدادات"}
            </Button>
            {stores.length > 1 && (
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive h-11 gap-2"
                onClick={() => {
                  deleteStore(selectedStore.id);
                  setView("list");
                  toast({ title: lang === "ku" ? "فرۆشگا سڕایەوە" : "تم حذف المتجر" });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ─── STORE LIST VIEW ───
  const firstStore = stores[0];
  const additionalStores = stores.slice(1);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title={lang === "ku" ? "فرۆشگاکان" : "المتاجر"}
        subtitle={`${stores.length} ${lang === "ku" ? "فرۆشگا" : "متجر"}`}
        actions={
          <Button onClick={() => setView("add")} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            {lang === "ku" ? "فرۆشگای نوێ" : "متجر جديد"}
          </Button>
        }
      />
      <main className="container mx-auto px-4 space-y-4">
        {/* Active store indicator */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Check className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground">{lang === "ku" ? "فرۆشگای چالاک" : "المتجر النشط"}</p>
            <p className="text-xs font-bold text-foreground">{stores.find((s) => s.id === activeStoreId)?.name}</p>
          </div>
        </div>

        {/* First store - always visible */}
        {firstStore && (
          <StoreCard
            store={firstStore}
            isActive={firstStore.id === activeStoreId}
            onSelect={() => openDetail(firstStore)}
            onSetActive={() => setActiveStoreId(firstStore.id)}
            lang={lang}
          />
        )}

        {/* Additional stores - PRO gated */}
        {additionalStores.length > 0 && (
          <ProGate feature={lang === "ku" ? "زیادکردنی فرۆشگای زیاتر" : "إضافة متاجر متعددة"}>
            <div className="space-y-3">
              {additionalStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  isActive={store.id === activeStoreId}
                  onSelect={() => openDetail(store)}
                  onSetActive={() => setActiveStoreId(store.id)}
                  lang={lang}
                />
              ))}
            </div>
          </ProGate>
        )}
      </main>
    </div>
  );
};

// ─── STORE CARD COMPONENT ───
const StoreCard = ({
  store, isActive, onSelect, onSetActive, lang,
}: {
  store: StoreItem; isActive: boolean; onSelect: () => void; onSetActive: () => void; lang: string;
}) => (
  <div
    onClick={onSelect}
    className={`bg-card border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all ${isActive ? "border-primary/50 ring-1 ring-primary/20" : "border-border"}`}
  >
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {store.logo ? (
          <img src={store.logo} alt="" className="w-full h-full object-cover" />
        ) : (
          <Store className="h-5 w-5 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">{store.name}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${store.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
            {store.active ? (lang === "ku" ? "چالاک" : "نشط") : (lang === "ku" ? "ناچالاک" : "متوقف")}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Globe className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground" dir="ltr">{store.domain}</span>
        </div>
        {store.location && (
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{store.location}</span>
          </div>
        )}
      </div>
    </div>

    {/* Quick stats */}
    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
      <div className="text-center">
        <span className="text-sm font-bold text-foreground block">{store.products}</span>
        <span className="text-[10px] text-muted-foreground">{lang === "ku" ? "بەرهەم" : "منتج"}</span>
      </div>
      <div className="text-center">
        <span className="text-sm font-bold text-foreground block">{store.orders}</span>
        <span className="text-[10px] text-muted-foreground">{lang === "ku" ? "داواکاری" : "طلب"}</span>
      </div>
      <div className="text-center">
        <span className="text-sm font-bold text-foreground block">{store.managers}</span>
        <span className="text-[10px] text-muted-foreground">{lang === "ku" ? "بەڕێوەبەر" : "مدير"}</span>
      </div>
    </div>

    {/* Set active button */}
    {!isActive && (
      <button
        onClick={(e) => { e.stopPropagation(); onSetActive(); }}
        className="w-full mt-3 py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
      >
        {lang === "ku" ? "کردن بە فرۆشگای سەرەکی" : "تعيين كمتجر نشط"}
      </button>
    )}
  </div>
);

export default Stores;
