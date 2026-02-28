import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  User, Mail, Phone, Store, Globe as GlobeIcon, Shield, LogOut, Camera, Save,
  FileText, MessageCircle, Instagram, Facebook, ShoppingBag, Link2,
  Languages, Sun, Moon, Bell, HelpCircle, ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { useLanguage, type Lang } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";

const LANG_OPTIONS: { value: Lang; label: string; native: string }[] = [
  { value: "ar", label: "العربية", native: "العربية" },
  { value: "ku", label: "کوردی", native: "کوردی سۆرانی" },
];

const TABS_AR = [
  { id: "account", label: "حسابي", icon: User },
  { id: "settings", label: "الإعدادات", icon: Sun },
  { id: "help", label: "المساعدة", icon: HelpCircle },
];

const TABS_KU = [
  { id: "account", label: "هەژمارەکەم", icon: User },
  { id: "settings", label: "ڕێکخستنەکان", icon: Sun },
  { id: "help", label: "یارمەتی", icon: HelpCircle },
];

const Profile = () => {
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "account");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["account", "settings", "help"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [profile, setProfile] = useState({
    name: "أحمد التاجر",
    email: "ahmed@example.com",
    phone: "0770 123 4567",
  });

  const [storeInfo, setStoreInfo] = useState({
    storeName: "المتجر الرئيسي",
    storeDescription: "متجر متخصص ببيع الملابس والأزياء العصرية بأسعار مناسبة",
    domain: "mystore.matager.store",
    whatsapp: "07701234567",
    instagram: "https://instagram.com/mystore",
    facebook: "",
    tiktok: "",
  });

  const [settings, setSettings] = useState({
    notifications: true,
    orderAlerts: true,
    emailUpdates: false,
  });

  const saveProfile = () => {
    setEditing(false);
    toast({ title: t.profile.saved, description: t.profile.savedDesc });
  };

  const tabs = lang === "ku" ? TABS_KU : TABS_AR;

  const faqs = lang === "ku" ? [
    { q: "چۆن بەرهەمێکی نوێ زیاد بکەم؟", a: "لە سەرەتا بچۆ بۆ بەرهەمەکان و دوگمەی 'زیادکردنی بەرهەم' دابگرە." },
    { q: "چۆن داواکارییەکان بەدواداچم؟", a: "لە بەشی داواکارییەکان دەتوانیت هەموو داواکارییەکان ببینیت و دۆخیان بگۆڕیت." },
    { q: "چۆن پلانەکەم بەرزبکەمەوە؟", a: "بچۆ بۆ زیاتر > حسابی > پلان و بەشداریکردن." },
  ] : [
    { q: "كيف أضيف منتج جديد؟", a: "من الصفحة الرئيسية انتقل إلى المنتجات واضغط على زر 'إضافة منتج'." },
    { q: "كيف أتابع الطلبات؟", a: "من قسم الطلبات يمكنك عرض جميع الطلبات وتغيير حالتها." },
    { q: "كيف أرقّي باقتي؟", a: "انتقل إلى المزيد > حسابي > الباقة والاشتراك." },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title={t.profile.title}
        actions={activeTab === "account" ? (
          <Button variant={editing ? "default" : "outline"} size="sm" onClick={() => editing ? saveProfile() : setEditing(true)} className="gap-1.5">
            {editing ? <><Save className="h-3.5 w-3.5" /> {t.save}</> : t.edit}
          </Button>
        ) : undefined}
      />

      <main className="container mx-auto px-4 pt-4 space-y-5">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id !== "account") setEditing(false); }}
              className={`flex items-center gap-1.5 flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
                activeTab === tab.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/30"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ ACCOUNT TAB ═══ */}
        {activeTab === "account" && (
          <div className="space-y-5">
            {/* Avatar & Name */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">أ</div>
                  {editing && (
                    <button className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center">
                      <Camera className="h-3 w-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-foreground">{profile.name}</h2>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  <p className="text-[11px] text-primary mt-0.5">{storeInfo.storeName}</p>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground">{t.profile.accountInfo}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><User className="h-3 w-3" /> {t.profile.name}</label>
                  {editing ? <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /> : <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg">{profile.name}</p>}
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Mail className="h-3 w-3" /> {t.profile.email}</label>
                  <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">{profile.email}</p>
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Phone className="h-3 w-3" /> {t.profile.phone}</label>
                  {editing ? <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} dir="ltr" /> : <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">{profile.phone}</p>}
                </div>
              </div>
            </div>

            {/* Store Info */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground">{t.profile.storeInfo}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Store className="h-3 w-3" /> {t.profile.storeName}</label>
                  {editing ? <Input value={storeInfo.storeName} onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })} /> : <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg">{storeInfo.storeName}</p>}
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><FileText className="h-3 w-3" /> {t.profile.storeDesc}</label>
                  {editing ? (
                    <Textarea value={storeInfo.storeDescription} onChange={(e) => setStoreInfo({ ...storeInfo, storeDescription: e.target.value })} className="min-h-[70px] resize-none text-sm" maxLength={200} />
                  ) : (
                    <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg leading-relaxed">{storeInfo.storeDescription || <span className="text-muted-foreground">{t.profile.noDesc}</span>}</p>
                  )}
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><GlobeIcon className="h-3 w-3" /> {t.profile.domain}</label>
                  <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">{storeInfo.domain}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Link2 className="h-3 w-3" /> {t.profile.socialLinks}
              </h3>
              <div className="space-y-3">
                {([
                  { key: "whatsapp" as const, label: "واتساب", icon: MessageCircle, color: "text-green-500", placeholder: "07XX XXX XXXX" },
                  { key: "instagram" as const, label: "Instagram", icon: Instagram, color: "text-pink-500", placeholder: "https://instagram.com/..." },
                  { key: "facebook" as const, label: "Facebook", icon: Facebook, color: "text-blue-500", placeholder: "https://facebook.com/..." },
                  { key: "tiktok" as const, label: "TikTok", icon: ShoppingBag, color: "text-foreground", placeholder: "https://tiktok.com/@..." },
                ]).map((social) => (
                  <div key={social.key}>
                    <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                      <social.icon className={`h-3 w-3 ${social.color}`} /> {social.label}
                    </label>
                    {editing ? (
                      <Input value={storeInfo[social.key]} onChange={(e) => setStoreInfo({ ...storeInfo, [social.key]: e.target.value })} placeholder={social.placeholder} dir="ltr" className="text-xs" />
                    ) : (
                      <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">
                        {storeInfo[social.key] || <span className="text-muted-foreground text-xs">{t.profile.notAdded}</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security & Logout */}
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              <button className="flex items-center gap-3 w-full px-4 py-3.5 text-right hover:bg-muted/50 transition-colors">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground flex-1">{t.profile.changePassword}</p>
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3.5 text-right hover:bg-destructive/5 transition-colors">
                <LogOut className="h-4 w-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">{t.profile.logout}</p>
              </button>
            </div>
          </div>
        )}

        {/* ═══ SETTINGS TAB ═══ */}
        {activeTab === "settings" && (
          <div className="space-y-5">
            {/* Language */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Languages className="h-3 w-3" /> {t.profile.language}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {LANG_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLang(option.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      lang === option.value ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <span className="text-sm font-bold text-foreground">{option.label}</span>
                    <span className="text-[10px] text-muted-foreground">{option.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sun className="h-3 w-3" /> {t.profile.appearance}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: "light" as const, label: t.profile.lightMode, icon: Sun },
                  { value: "dark" as const, label: t.profile.darkMode, icon: Moon },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      theme === option.value ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <option.icon className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-bold text-foreground">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              <div className="p-4 pb-3">
                <h3 className="text-xs font-semibold text-muted-foreground">{t.profile.notificationSettings}</h3>
              </div>
              {[
                { label: t.profile.orderAlerts, desc: t.profile.orderAlertsDesc, key: "orderAlerts" as const, icon: Bell },
                { label: t.profile.generalNotif, desc: t.profile.generalNotifDesc, key: "notifications" as const, icon: Bell },
                { label: t.profile.emailUpdates, desc: t.profile.emailUpdatesDesc, key: "emailUpdates" as const, icon: Mail },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <setting.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{setting.label}</p>
                      <p className="text-[11px] text-muted-foreground">{setting.desc}</p>
                    </div>
                  </div>
                  <Switch checked={settings[setting.key]} onCheckedChange={(checked) => setSettings({ ...settings, [setting.key]: checked })} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ HELP TAB ═══ */}
        {activeTab === "help" && (
          <div className="space-y-5">
            {/* Contact */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground">
                {lang === "ku" ? "پەیوەندیمان پێوە بکە" : "تواصل معنا"}
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => window.open("https://wa.me/9647700000000", "_blank")}>
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{lang === "ku" ? "واتسئاپ" : "واتساب"}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground mr-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => window.open("mailto:support@matager.store")}>
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">support@matager.store</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground mr-auto" />
                </Button>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <HelpCircle className="h-3 w-3" />
                {lang === "ku" ? "پرسیارە باوەکان" : "الأسئلة الشائعة"}
              </h3>
              <div className="divide-y divide-border">
                {faqs.map((faq) => (
                  <div key={faq.q} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-foreground">{faq.q}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Docs */}
            <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => window.open("https://docs.matager.store", "_blank")}>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{lang === "ku" ? "بەڵگەنامەکان" : "التوثيق والمستندات"}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground mr-auto" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
