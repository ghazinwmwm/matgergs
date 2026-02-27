import { useState } from "react";
import { User, Mail, Phone, Store, Globe, Bell, Moon, Sun, Languages, Shield, LogOut, ChevronLeft, Camera, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "أحمد التاجر",
    email: "ahmed@example.com",
    phone: "0770 123 4567",
    storeName: "المتجر الرئيسي",
    domain: "mystore.matager.store",
  });

  const [settings, setSettings] = useState({
    notifications: true,
    orderAlerts: true,
    emailUpdates: false,
    darkMode: false,
  });

  const saveProfile = () => {
    setEditing(false);
    toast({ title: "تم الحفظ", description: "تم تحديث بيانات الحساب بنجاح" });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-10 pb-4">
        <h1 className="text-xl font-bold text-foreground">حسابي</h1>
      </div>

      <main className="container mx-auto px-4 space-y-5">
        {/* Avatar & Name */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                أ
              </div>
              <button className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center">
                <Camera className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-foreground">{profile.name}</h2>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
              <p className="text-[11px] text-primary mt-0.5">{profile.storeName}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => editing ? saveProfile() : setEditing(true)} className="gap-1">
              {editing ? <><Save className="h-3 w-3" /> حفظ</> : "تعديل"}
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground">معلومات الحساب</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                <User className="h-3 w-3" /> الاسم
              </label>
              {editing ? (
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              ) : (
                <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg">{profile.name}</p>
              )}
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                <Mail className="h-3 w-3" /> البريد الإلكتروني
              </label>
              {editing ? (
                <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} dir="ltr" />
              ) : (
                <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">{profile.email}</p>
              )}
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                <Phone className="h-3 w-3" /> رقم الهاتف
              </label>
              {editing ? (
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} dir="ltr" />
              ) : (
                <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">{profile.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground">معلومات المتجر</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                <Store className="h-3 w-3" /> اسم المتجر
              </label>
              {editing ? (
                <Input value={profile.storeName} onChange={(e) => setProfile({ ...profile, storeName: e.target.value })} />
              ) : (
                <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg">{profile.storeName}</p>
              )}
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                <Globe className="h-3 w-3" /> الدومين
              </label>
              <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-lg" dir="ltr">{profile.domain}</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          <div className="p-4 pb-3">
            <h3 className="text-xs font-semibold text-muted-foreground">الإعدادات</h3>
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
              <Switch
                checked={settings[setting.key]}
                onCheckedChange={(checked) => setSettings({ ...settings, [setting.key]: checked })}
              />
            </div>
          ))}
        </div>

        {/* Security & Logout */}
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          <button className="flex items-center gap-3 w-full px-4 py-3.5 text-right hover:bg-muted/50 transition-colors">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">تغيير كلمة المرور</p>
            </div>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
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
