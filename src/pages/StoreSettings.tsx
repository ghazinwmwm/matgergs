import { useState } from "react";
import {
  Store, Globe, MapPin, MessageCircle, Instagram, Facebook, ShoppingBag,
  Image, FileText, Save, Trash2, ToggleLeft, ToggleRight, ExternalLink,
  Palette, Bell, Shield, Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStores, type StoreItem } from "@/hooks/useStores";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/hooks/use-toast";

const STORE_CATEGORIES = [
  "ملابس وأزياء", "إلكترونيات", "مواد غذائية", "مستحضرات تجميل",
  "أحذية وحقائب", "أثاث ومفروشات", "هدايا وتحف", "أخرى"
];

const StoreSettings = () => {
  const { id } = useParams<{ id: string }>();
  const { stores, updateStore, deleteStore, toggleStoreActive } = useStores();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const store = stores.find((s) => s.id === id);

  const [form, setForm] = useState<StoreItem | null>(store ? { ...store } : null);
  const [activeSection, setActiveSection] = useState("identity");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!form || !store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{lang === "ku" ? "فرۆشگا نەدۆزرایەوە" : "المتجر غير موجود"}</p>
      </div>
    );
  }

  const handleSave = () => {
    updateStore(form);
    toast({ title: lang === "ku" ? "✓ گۆڕانکاریەکان پاشەکەوتکران" : "✓ تم حفظ التغييرات" });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm((prev) => prev ? { ...prev, logo: reader.result as string } : prev);
      reader.readAsDataURL(file);
    }
  };

  const sections = [
    { id: "identity", icon: Store, label: lang === "ku" ? "ناسنامە" : "الهوية" },
    { id: "domain", icon: Globe, label: lang === "ku" ? "دۆمەین" : "النطاق" },
    { id: "social", icon: Link2, label: lang === "ku" ? "لینکەکان" : "الروابط" },
    { id: "danger", icon: Shield, label: lang === "ku" ? "مەترسی" : "خطر" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title={lang === "ku" ? "ڕێکخستنەکانی فرۆشگا" : "إعدادات المتجر"}
        subtitle={store.name}
        actions={
          <Button size="sm" onClick={handleSave} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            {lang === "ku" ? "پاشەکەوتکردن" : "حفظ"}
          </Button>
        }
      />

      <main className="container mx-auto px-4 py-4 space-y-5">
        {/* Section tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                activeSection === s.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/30"
              }`}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}
        </div>

        {/* ─── IDENTITY SECTION ─── */}
        {activeSection === "identity" && (
          <div className="space-y-5">
            {/* Logo */}
            <div className="flex flex-col items-center gap-3">
              <label htmlFor="settings-logo" className="cursor-pointer group">
                <div className={`w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all overflow-hidden ${form.logo ? "border-primary" : "border-border group-hover:border-primary/50"}`}>
                  {form.logo ? (
                    <img src={form.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Image className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] text-muted-foreground">{lang === "ku" ? "لۆگۆ" : "الشعار"}</span>
                    </div>
                  )}
                </div>
              </label>
              <input id="settings-logo" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              {form.logo && (
                <button onClick={() => setForm((prev) => prev ? { ...prev, logo: null } : prev)} className="text-[11px] text-destructive">
                  {lang === "ku" ? "لابردنی لۆگۆ" : "إزالة الشعار"}
                </button>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                {lang === "ku" ? "ناوی فرۆشگا" : "اسم المتجر"}
              </label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11" />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                <FileText className="h-3.5 w-3.5 inline-block ml-1" />
                {lang === "ku" ? "وەسف" : "الوصف"}
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="min-h-[80px] resize-none text-sm"
                maxLength={200}
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-left" dir="ltr">{form.description.length}/200</p>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">{lang === "ku" ? "جۆر" : "التصنيف"}</label>
              <div className="grid grid-cols-2 gap-2">
                {STORE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${form.category === cat ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/30"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                <MapPin className="h-3.5 w-3.5 inline-block ml-1" />
                {lang === "ku" ? "شوێن" : "الموقع"}
              </label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="h-11" />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                <MessageCircle className="h-3.5 w-3.5 inline-block ml-1 text-green-500" />
                {lang === "ku" ? "واتسئاپ" : "واتساب"}
              </label>
              <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="h-11 text-xs" dir="ltr" type="tel" />
            </div>

            {/* Status toggle */}
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{lang === "ku" ? "دۆخی فرۆشگا" : "حالة المتجر"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {form.active
                    ? (lang === "ku" ? "فرۆشگا بۆ کڕیاران دەرکەوتووە" : "المتجر ظاهر للعملاء")
                    : (lang === "ku" ? "فرۆشگا داخراوە" : "المتجر مغلق حالياً")}
                </p>
              </div>
              <button
                onClick={() => setForm({ ...form, active: !form.active })}
                className={`flex items-center gap-1.5 text-xs font-medium ${form.active ? "text-success" : "text-muted-foreground"}`}
              >
                {form.active ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
              </button>
            </div>
          </div>
        )}

        {/* ─── DOMAIN SECTION ─── */}
        {activeSection === "domain" && (
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">{lang === "ku" ? "دۆمەینی سەرەکی" : "النطاق الرئيسي"}</h3>
              <div className="flex items-center gap-0 border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                <span className="text-[11px] text-muted-foreground bg-secondary px-3 py-2.5 border-l border-input whitespace-nowrap" dir="ltr">.matager.store</span>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""), domain: `${e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")}.matager.store` })}
                  className="flex-1 h-11 px-3 text-xs bg-background text-foreground placeholder:text-muted-foreground outline-none"
                  dir="ltr"
                />
              </div>
              <div className="mt-3 bg-secondary/50 rounded-lg p-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground" dir="ltr">{form.domain}</span>
                <button onClick={() => window.open(`https://${form.domain}`, "_blank")} className="mr-auto">
                  <ExternalLink className="h-3.5 w-3.5 text-primary" />
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">{lang === "ku" ? "دۆمەینی تایبەت" : "نطاق مخصص"}</h3>
              <p className="text-xs text-muted-foreground mb-3">
                {lang === "ku" ? "بەزوودی بەردەست دەبێت" : "قريباً - ربط نطاقك الخاص"}
              </p>
              <Button variant="outline" disabled className="w-full h-10 text-xs">
                {lang === "ku" ? "بەزوودی" : "قريباً"}
              </Button>
            </div>
          </div>
        )}

        {/* ─── SOCIAL LINKS SECTION ─── */}
        {activeSection === "social" && (
          <div className="space-y-4">
            {[
              { key: "instagram", icon: Instagram, label: "Instagram", placeholder: "https://instagram.com/..." },
              { key: "facebook", icon: Facebook, label: "Facebook", placeholder: "https://facebook.com/..." },
              { key: "tiktok", icon: ShoppingBag, label: "TikTok", placeholder: "https://tiktok.com/@..." },
              { key: "website", icon: Globe, label: lang === "ku" ? "ماڵپەڕ" : "الموقع", placeholder: "https://..." },
            ].map((social) => (
              <div key={social.key} className="bg-card border border-border rounded-xl p-4">
                <label className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
                  <social.icon className="h-4 w-4 text-muted-foreground" />
                  {social.label}
                </label>
                <Input
                  value={form.socialLinks[social.key] || ""}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [social.key]: e.target.value } })}
                  placeholder={social.placeholder}
                  className="h-10 text-xs"
                  dir="ltr"
                />
              </div>
            ))}
          </div>
        )}

        {/* ─── DANGER ZONE ─── */}
        {activeSection === "danger" && (
          <div className="space-y-4">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-destructive mb-1">{lang === "ku" ? "ناوچەی مەترسیدار" : "منطقة الخطر"}</h3>
              <p className="text-xs text-muted-foreground mb-4">
                {lang === "ku"
                  ? "ئەم کردارانە ناگەڕێنەوە. تکایە وریابە."
                  : "هذه الإجراءات لا يمكن التراجع عنها. يرجى الحذر."}
              </p>

              {stores.length > 1 ? (
                confirmDelete ? (
                  <div className="space-y-3">
                    <p className="text-xs text-destructive font-medium">
                      {lang === "ku"
                        ? `دڵنیایت لە سڕینەوەی "${store.name}"؟`
                        : `هل أنت متأكد من حذف "${store.name}"؟`}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={() => {
                          deleteStore(store.id);
                          toast({ title: lang === "ku" ? "فرۆشگا سڕایەوە" : "تم حذف المتجر" });
                          navigate("/stores");
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {lang === "ku" ? "بەڵێ، بسڕەوە" : "نعم، احذف"}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirmDelete(false)}>
                        {lang === "ku" ? "پاشگەزبوونەوە" : "تراجع"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5 gap-2"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {lang === "ku" ? "سڕینەوەی فرۆشگا" : "حذف المتجر"}
                  </Button>
                )
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  {lang === "ku"
                    ? "ناتوانیت تاکە فرۆشگات بسڕیتەوە"
                    : "لا يمكن حذف المتجر الوحيد"}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoreSettings;
