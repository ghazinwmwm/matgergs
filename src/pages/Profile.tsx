import { useState } from "react";
import { User, Mail, Phone, Store, Globe as GlobeIcon, Bell, Shield, LogOut, Camera, Save, FileText, MessageCircle, Instagram, Facebook, ShoppingBag, Link2, Languages, Sun, Moon } from "lucide-react";
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

const Profile = () => {
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [editing, setEditing] = useState(false);
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title={t.profile.title}
        actions={
          <Button variant={editing ? "default" : "outline"} size="sm" onClick={() => editing ? saveProfile() : setEditing(true)} className="gap-1.5">
            {editing ? <><Save className="h-3.5 w-3.5" /> {t.save}</> : t.edit}
          </Button>
        }
      />

      <main className="container mx-auto px-4 pt-4 space-y-5">
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

        {/* Language Selector */}
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
                  lang === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <span className="text-sm font-bold text-foreground">{option.label}</span>
                <span className="text-[10px] text-muted-foreground">{option.native}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance / Dark Mode */}
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
                  theme === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <option.icon className="h-5 w-5 text-foreground" />
                <span className="text-sm font-bold text-foreground">{option.label}</span>
              </button>
            ))}
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

        {/* Notification Settings */}
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
      </main>
    </div>
  );
};

export default Profile;
