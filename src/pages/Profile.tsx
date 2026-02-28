import { useState } from "react";
import { User, Mail, Phone, Store, Globe, Bell, Shield, LogOut, Camera, Save, FileText, MessageCircle, Instagram, Facebook, ShoppingBag, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";

const Profile = () => {
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
    toast({ title: "تم الحفظ ✓", description: "تم تحديث البيانات بنجاح" });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="حسابي"
        actions={
          <Button variant={editing ? "default" : "outline"} size="sm" onClick={() => editing ? saveProfile() : setEditing(true)} className="gap-1.5">
            {editing ? <><Save className="h-3.5 w-3.5" /> حفظ</> : "تعديل"}
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

        {/* Personal Info */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground">معلومات الحساب</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><User className="h-3 w-3" /> الاسم</label>
              {editing ? <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /> : <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg">{profile.name}</p>}
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Mail className="h-3 w-3" /> البريد الإلكتروني</label>
              <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">{profile.email}</p>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Phone className="h-3 w-3" /> رقم الهاتف</label>
              {editing ? <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} dir="ltr" /> : <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">{profile.phone}</p>}
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground">معلومات المتجر</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Store className="h-3 w-3" /> اسم المتجر</label>
              {editing ? <Input value={storeInfo.storeName} onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })} /> : <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg">{storeInfo.storeName}</p>}
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><FileText className="h-3 w-3" /> وصف المتجر</label>
              {editing ? (
                <Textarea value={storeInfo.storeDescription} onChange={(e) => setStoreInfo({ ...storeInfo, storeDescription: e.target.value })} className="min-h-[70px] resize-none text-sm" maxLength={200} />
              ) : (
                <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg leading-relaxed">{storeInfo.storeDescription || <span className="text-muted-foreground">لم يتم إضافة وصف</span>}</p>
              )}
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Globe className="h-3 w-3" /> النطاق</label>
              <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">{storeInfo.domain}</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Link2 className="h-3 w-3" /> روابط التواصل
          </h3>
          <div className="space-y-3">
            {[
              { key: "whatsapp" as const, label: "واتساب", icon: MessageCircle, color: "text-green-500", placeholder: "07XX XXX XXXX" },
              { key: "instagram" as const, label: "Instagram", icon: Instagram, color: "text-pink-500", placeholder: "https://instagram.com/..." },
              { key: "facebook" as const, label: "Facebook", icon: Facebook, color: "text-blue-500", placeholder: "https://facebook.com/..." },
              { key: "tiktok" as const, label: "TikTok", icon: ShoppingBag, color: "text-foreground", placeholder: "https://tiktok.com/@..." },
            ].map((social) => (
              <div key={social.key}>
                <label className={`text-[11px] text-muted-foreground mb-1 flex items-center gap-1`}>
                  <social.icon className={`h-3 w-3 ${social.color}`} /> {social.label}
                </label>
                {editing ? (
                  <Input value={storeInfo[social.key]} onChange={(e) => setStoreInfo({ ...storeInfo, [social.key]: e.target.value })} placeholder={social.placeholder} dir="ltr" className="text-xs" />
                ) : (
                  <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">
                    {storeInfo[social.key] || <span className="text-muted-foreground text-xs">لم يتم الإضافة</span>}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          <div className="p-4 pb-3">
            <h3 className="text-xs font-semibold text-muted-foreground">الإشعارات</h3>
          </div>
          {[
            { label: "إشعارات الطلبات", desc: "تلقي إشعار عند وصول طلب جديد", key: "orderAlerts" as const, icon: Bell },
            { label: "إشعارات عامة", desc: "التحديثات والعروض", key: "notifications" as const, icon: Bell },
            { label: "تحديثات البريد", desc: "تقارير أسبوعية عبر البريد", key: "emailUpdates" as const, icon: Mail },
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
            <p className="text-sm font-medium text-foreground flex-1">تغيير كلمة المرور</p>
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3.5 text-right hover:bg-destructive/5 transition-colors">
            <LogOut className="h-4 w-4 text-destructive" />
            <p className="text-sm font-medium text-destructive">تسجيل الخروج</p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
