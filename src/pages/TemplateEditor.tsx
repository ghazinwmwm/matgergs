import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Palette, Type, Image, Layout, Eye, Save, Sparkles,
  RotateCcw, Globe, Instagram, Phone, Mail, MessageCircle,
  ChevronDown, ChevronUp, Plus, X, GripVertical, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";

interface SectionConfig {
  id: string;
  label: string;
  enabled: boolean;
  icon: React.ElementType;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "hero", label: "الصفحة الرئيسية (Hero)", enabled: true, icon: Layout },
  { id: "services", label: "الخدمات", enabled: true, icon: Sparkles },
  { id: "works", label: "معرض الأعمال", enabled: true, icon: Image },
  { id: "store", label: "المتجر", enabled: true, icon: Monitor },
  { id: "testimonials", label: "آراء العملاء", enabled: true, icon: MessageCircle },
  { id: "about", label: "من نحن", enabled: true, icon: Globe },
  { id: "cta", label: "دعوة للإجراء (CTA)", enabled: true, icon: Sparkles },
];

const COLOR_PRESETS = [
  { name: "تيركوازي", primary: "191 80% 42%", accent: "200 85% 52%" },
  { name: "بنفسجي", primary: "262 80% 50%", accent: "280 70% 60%" },
  { name: "أخضر", primary: "160 60% 42%", accent: "140 50% 50%" },
  { name: "برتقالي", primary: "24 95% 53%", accent: "36 95% 55%" },
  { name: "وردي", primary: "340 75% 55%", accent: "350 80% 65%" },
  { name: "أزرق داكن", primary: "220 70% 40%", accent: "210 80% 55%" },
];

const TemplateEditor = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"brand" | "sections" | "contact">("brand");

  // Brand
  const [storeName, setStoreName] = useState("استوديو إبداع");
  const [tagline, setTagline] = useState("نصنع تجارب رقمية تُلهم وتُحقق النتائج");
  const [storeDescription, setStoreDescription] = useState("دورات تعليمية، أدوات تصميم، وخدمات إبداعية من فريق متخصص.");
  const [selectedPreset, setSelectedPreset] = useState(0);

  // Sections
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);

  // Contact
  const [contactEmail, setContactEmail] = useState("hello@studio.com");
  const [contactPhone, setContactPhone] = useState("+964 770 123 4567");
  const [contactInstagram, setContactInstagram] = useState("@studio_iq");
  const [contactWebsite, setContactWebsite] = useState("www.studio.com");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = () => {
    toast({ title: "تم الحفظ ✓", description: "تم حفظ إعدادات القالب بنجاح" });
  };

  const handlePreview = () => {
    const w = 1200, h = 800;
    const left = (screen.width - w) / 2, top = (screen.height - h) / 2;
    window.open("/storefront", "storefront", `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`);
  };

  const tabs = [
    { id: "brand" as const, label: "الهوية", icon: Palette },
    { id: "sections" as const, label: "الأقسام", icon: Layout },
    { id: "contact" as const, label: "التواصل", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="تخصيص القالب" subtitle="عدّل على متجرك بالطريقة التي تريدها" />

      <main className="container mx-auto max-w-2xl px-4 space-y-5">
        {/* Tabs */}
        <div className="flex gap-1.5 bg-muted rounded-xl p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ═══════ BRAND TAB ═══════ */}
        {activeTab === "brand" && (
          <div className="space-y-6">
            {/* Store name & tagline */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                اسم المتجر والوصف
              </h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">اسم المتجر</Label>
                  <Input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="اسم متجرك" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">الشعار النصي (Tagline)</Label>
                  <Input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="عبارة مميزة عن متجرك" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">وصف مختصر</Label>
                  <Textarea value={storeDescription} onChange={e => setStoreDescription(e.target.value)} rows={2} placeholder="وصف المتجر..." />
                </div>
              </div>
            </div>

            {/* Color presets */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                ألوان المتجر
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PRESETS.map((preset, i) => {
                  const [h, s, l] = preset.primary.split(" ");
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedPreset(i)}
                      className={`relative rounded-xl p-3 border-2 transition-all ${
                        selectedPreset === i ? "border-foreground shadow-md" : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <div className="flex gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${preset.primary})` }} />
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${preset.accent})` }} />
                      </div>
                      <p className="text-[10px] font-semibold text-foreground">{preset.name}</p>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground text-center">* تطبيق الألوان سيظهر عند معاينة المتجر</p>
            </div>

            {/* Logo upload */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Image className="h-4 w-4 text-primary" />
                شعار المتجر
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:bg-primary/15 transition-colors">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">رفع شعار</p>
                  <p className="text-[10px] text-muted-foreground">PNG أو SVG بحجم أقصى 2MB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ SECTIONS TAB ═══════ */}
        {activeTab === "sections" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">فعّل أو عطّل أقسام المتجر حسب حاجتك</p>
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className={`bg-card border rounded-xl p-4 flex items-center gap-3 transition-all ${
                    section.enabled ? "border-primary/30 bg-primary/[0.02]" : "border-border opacity-60"
                  }`}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 cursor-grab" />
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    section.enabled ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Icon className={`h-4 w-4 ${section.enabled ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <span className={`text-sm font-medium flex-1 ${section.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                    {section.label}
                  </span>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      section.enabled ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-background shadow-sm absolute top-0.5 transition-all ${
                      section.enabled ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════ CONTACT TAB ═══════ */}
        {activeTab === "contact" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">معلومات التواصل</h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5"><Mail className="h-3 w-3 text-muted-foreground" /> البريد الإلكتروني</Label>
                  <Input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="email@example.com" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5"><Phone className="h-3 w-3 text-muted-foreground" /> رقم الهاتف</Label>
                  <Input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+964 7xx xxx xxxx" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5"><MessageCircle className="h-3 w-3 text-muted-foreground" /> واتساب</Label>
                  <Input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="رقم الواتساب (اختياري)" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5"><Instagram className="h-3 w-3 text-muted-foreground" /> انستقرام</Label>
                  <Input value={contactInstagram} onChange={e => setContactInstagram(e.target.value)} placeholder="@username" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5"><Globe className="h-3 w-3 text-muted-foreground" /> الموقع الإلكتروني</Label>
                  <Input value={contactWebsite} onChange={e => setContactWebsite(e.target.value)} placeholder="www.example.com" dir="ltr" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} className="flex-1 h-12 gap-2 text-sm">
            <Save className="h-4 w-4" />
            حفظ التغييرات
          </Button>
          <Button onClick={handlePreview} variant="outline" className="h-12 gap-2 text-sm px-6">
            <Eye className="h-4 w-4" />
            معاينة
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TemplateEditor;
