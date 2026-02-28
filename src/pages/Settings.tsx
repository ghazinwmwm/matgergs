import { useState } from "react";
import { Bell, Mail, Languages, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/PageHeader";
import { useLanguage, type Lang } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";

const LANG_OPTIONS: { value: Lang; label: string; native: string }[] = [
  { value: "ar", label: "العربية", native: "العربية" },
  { value: "ku", label: "کوردی", native: "کوردی سۆرانی" },
];

const Settings = () => {
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState({
    notifications: true,
    orderAlerts: true,
    emailUpdates: false,
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={lang === "ku" ? "ڕێکخستنەکان" : "الإعدادات"} />

      <main className="container mx-auto px-4 pt-4 space-y-5">
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
      </main>
    </div>
  );
};

export default Settings;
