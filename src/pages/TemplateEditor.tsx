import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette, Type, Image, Layout, Eye, Save, Sparkles,
  Globe, Instagram, Phone, Mail, MessageCircle,
  Plus, X, Monitor, Trash2, Edit3,
  ChevronDown, Upload, Star, Quote,
  Briefcase, Award, Zap, Heart,
  PenTool, Camera, Code, ShoppingBag, FileText,
  GripVertical, RotateCcw, Copy, Layers,
  ArrowUp, ArrowDown, Settings2, Smartphone, Link2,
  Check, ExternalLink, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import {
  useTemplateConfig,
  COLOR_PRESETS,
  COLOR_PRESET_NAMES,
  type SectionConfig,
  type ServiceItem,
  type WorkItem,
  type TestimonialItem,
} from "@/hooks/useTemplateConfig";

// ═══════════════════════════════════════
// ICON MAP
// ═══════════════════════════════════════

const ICON_MAP: Record<string, React.ElementType> = {
  Palette, Monitor, Code, Camera, PenTool, Briefcase, Sparkles, Zap, Heart, Star, ShoppingBag, FileText,
  Layout, Image, Quote, Globe, MessageCircle, Award, Layers,
};

const ICON_OPTIONS = [
  { value: "Palette", label: "تصميم", Icon: Palette },
  { value: "Monitor", label: "واجهات", Icon: Monitor },
  { value: "Code", label: "برمجة", Icon: Code },
  { value: "Camera", label: "تصوير", Icon: Camera },
  { value: "PenTool", label: "كتابة", Icon: PenTool },
  { value: "Briefcase", label: "أعمال", Icon: Briefcase },
  { value: "Sparkles", label: "إبداع", Icon: Sparkles },
  { value: "Zap", label: "سريع", Icon: Zap },
  { value: "Heart", label: "صحة", Icon: Heart },
  { value: "Star", label: "مميز", Icon: Star },
  { value: "ShoppingBag", label: "تسوق", Icon: ShoppingBag },
  { value: "FileText", label: "مستند", Icon: FileText },
];

const SECTION_TEMPLATES = [
  { id: "faq", label: "الأسئلة الشائعة", icon: "MessageCircle", subtitle: "أجوبة على الأسئلة المتكررة", color: "hsl(var(--accent))" },
  { id: "stats", label: "إحصائيات", icon: "Award", subtitle: "أرقام وإنجازات بارزة", color: "hsl(var(--success))" },
  { id: "pricing", label: "الأسعار", icon: "ShoppingBag", subtitle: "جدول تسعير المنتجات", color: "hsl(var(--primary))" },
  { id: "gallery", label: "معرض صور", icon: "Camera", subtitle: "صور ومشاهد بصرية", color: "hsl(var(--destructive))" },
  { id: "partners", label: "الشركاء", icon: "Briefcase", subtitle: "شعارات العملاء والشركاء", color: "hsl(var(--muted-foreground))" },
];

const FONT_OPTIONS = [
  { value: "IBM Plex Sans Arabic", label: "IBM Plex", preview: "نص عربي احترافي" },
  { value: "Cairo", label: "القاهرة", preview: "خط القاهرة الحديث" },
  { value: "Tajawal", label: "تجوّل", preview: "خط تجول الأنيق" },
  { value: "Almarai", label: "المرعي", preview: "خط المرعي الواضح" },
  { value: "Noto Sans Arabic", label: "نوتو", preview: "خط نوتو العالمي" },
  { value: "Rubik", label: "روبيك", preview: "خط روبيك العصري" },
];

export const getIconComponent = (iconName: string): React.ElementType => ICON_MAP[iconName] || Sparkles;

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════

type TabId = "brand" | "design" | "sections" | "content" | "contact";

const TemplateEditor = () => {
  const navigate = useNavigate();
  const { config, updateConfig, resetConfig, getActiveColors } = useTemplateConfig();
  const [activeTab, setActiveTab] = useState<TabId>("brand");
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [editingWorkIdx, setEditingWorkIdx] = useState<number | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (setter: (v: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "حجم الملف كبير", description: "الحد الأقصى 2MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Section operations
  const toggleSection = (id: string) => {
    updateConfig({ sections: config.sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s) });
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    const sections = [...config.sections];
    const idx = sections.findIndex(s => s.id === id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === sections.length - 1)) return;
    [sections[idx], sections[idx + dir]] = [sections[idx + dir], sections[idx]];
    updateConfig({ sections });
  };

  const removeSection = (id: string) => {
    updateConfig({ sections: config.sections.filter(s => s.id !== id) });
    toast({ title: "تم حذف القسم" });
  };

  const duplicateSection = (id: string) => {
    const sections = [...config.sections];
    const idx = sections.findIndex(s => s.id === id);
    const section = sections[idx];
    const newSection = { ...section, id: `${section.id}-copy-${Date.now()}`, label: `${section.label} (نسخة)` };
    sections.splice(idx + 1, 0, newSection);
    updateConfig({ sections });
    toast({ title: "تم نسخ القسم" });
  };

  const updateSectionLabel = (id: string, label: string) => {
    updateConfig({ sections: config.sections.map(s => s.id === id ? { ...s, label } : s) });
  };

  const updateSectionSubtitle = (id: string, subtitle: string) => {
    updateConfig({ sections: config.sections.map(s => s.id === id ? { ...s, subtitle } : s) });
  };

  const addNewSection = (template: typeof SECTION_TEMPLATES[0]) => {
    const newSection: SectionConfig = {
      id: `${template.id}-${Date.now()}`,
      label: template.label,
      enabled: true,
      icon: template.icon,
      subtitle: template.subtitle,
      editable: true,
      color: template.color,
    };
    updateConfig({ sections: [...config.sections, newSection] });
    setShowAddSection(false);
    toast({ title: `تم إضافة "${template.label}"` });
  };

  // Content operations
  const addService = () => updateConfig({ services: [...config.services, { icon: "Sparkles", title: "خدمة جديدة", desc: "وصف الخدمة" }] });
  const removeService = (i: number) => updateConfig({ services: config.services.filter((_, idx) => idx !== i) });
  const updateService = (i: number, field: keyof ServiceItem, value: string) => {
    updateConfig({ services: config.services.map((s, idx) => idx === i ? { ...s, [field]: value } : s) });
  };

  const addWork = () => {
    updateConfig({ works: [...config.works, { title: "مشروع جديد", category: "تصنيف", link: "" }] });
    setEditingWorkIdx(config.works.length);
  };
  const removeWork = (i: number) => {
    updateConfig({ works: config.works.filter((_, idx) => idx !== i) });
    if (editingWorkIdx === i) setEditingWorkIdx(null);
  };
  const updateWork = (i: number, field: keyof WorkItem, value: string) => {
    updateConfig({ works: config.works.map((w, idx) => idx === i ? { ...w, [field]: value } : w) });
  };

  const addTestimonial = () => updateConfig({ testimonials: [...config.testimonials, { name: "عميل جديد", role: "الوظيفة", text: "رأي العميل...", rating: 5 }] });
  const removeTestimonial = (i: number) => updateConfig({ testimonials: config.testimonials.filter((_, idx) => idx !== i) });
  const updateTestimonial = (i: number, field: keyof TestimonialItem, value: string | number) => {
    updateConfig({ testimonials: config.testimonials.map((t, idx) => idx === i ? { ...t, [field]: value } : t) });
  };

  const addAboutFeature = () => updateConfig({ aboutFeatures: [...config.aboutFeatures, "ميزة جديدة"] });
  const removeAboutFeature = (i: number) => updateConfig({ aboutFeatures: config.aboutFeatures.filter((_, idx) => idx !== i) });

  const handleSave = () => toast({ title: "تم الحفظ ✓", description: "جميع التغييرات محفوظة" });
  const handlePreview = () => {
    const w = 1200, h = 800;
    const left = (screen.width - w) / 2, top = (screen.height - h) / 2;
    window.open("/storefront", "storefront", `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`);
  };

  const handleReset = () => {
    if (window.confirm("هل تريد إعادة تعيين جميع الإعدادات للافتراضي؟")) {
      resetConfig();
      toast({ title: "تم إعادة التعيين", description: "تمت إعادة جميع الإعدادات للافتراضي" });
    }
  };

  const activeColors = getActiveColors();
  const enabledCount = config.sections.filter(s => s.enabled).length;

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "brand", label: "الهوية", icon: Type },
    { id: "design", label: "التصميم", icon: Palette },
    { id: "sections", label: "الأقسام", icon: Layers },
    { id: "content", label: "المحتوى", icon: Edit3 },
    { id: "contact", label: "التواصل", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-background pb-36" dir="rtl">
      <PageHeader title="تخصيص القالب" subtitle="صمم متجرك بحرية مطلقة" />

      <main className="container mx-auto max-w-lg px-4">

        {/* ═══ MINI LIVE PREVIEW ═══ */}
        <div className="mb-4 rounded-2xl border border-border overflow-hidden bg-card">
          <div className="px-3 py-2 border-b border-border/50 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold text-muted-foreground">معاينة سريعة</span>
            </div>
            <Button size="sm" variant="ghost" onClick={handlePreview} className="h-7 text-[10px] gap-1 text-primary">
              <ExternalLink className="h-3 w-3" /> معاينة كاملة
            </Button>
          </div>
          <div className="p-4" style={{ backgroundColor: activeColors.bg }}>
            <div className="flex items-center gap-3 mb-3">
              {config.logoImage ? (
                <img src={config.logoImage} alt="" className="w-8 h-8 rounded-xl object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: activeColors.primary }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold" style={{ color: activeColors.text, fontFamily: config.headingFont }}>{config.storeName}</p>
                <p className="text-[9px]" style={{ color: `${activeColors.text}66` }}>{config.tagline}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-8 rounded-lg text-[10px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: activeColors.primary }}>
                {config.heroButtonText}
              </div>
              <div className="flex-1 h-8 rounded-lg text-[10px] font-bold flex items-center justify-center border" style={{ borderColor: `${activeColors.text}20`, color: activeColors.text }}>
                {config.heroSecondaryButton}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TAB BAR ═══ */}
        <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl pb-3 pt-1 -mx-4 px-4">
          <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-semibold transition-all ${
                    isActive ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 mt-2">

          {/* ═══════════════════════════════════════ */}
          {/* BRAND TAB */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "brand" && (
            <div className="space-y-4">
              {/* Logo */}
              <SectionCard title="الشعار" icon={Image}>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload(v => updateConfig({ logoImage: v }))} />
                <div className="flex items-center gap-4">
                  {config.logoImage ? (
                    <div className="relative group">
                      <img src={config.logoImage} alt="Logo" className="w-16 h-16 rounded-2xl object-cover border border-border" />
                      <div className="absolute inset-0 bg-foreground/60 rounded-2xl flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => logoInputRef.current?.click()} className="w-7 h-7 rounded-lg bg-background/90 flex items-center justify-center">
                          <Upload className="h-3 w-3" />
                        </button>
                        <button onClick={() => updateConfig({ logoImage: null })} className="w-7 h-7 rounded-lg bg-destructive/90 flex items-center justify-center text-destructive-foreground">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => logoInputRef.current?.click()}
                      className="w-16 h-16 rounded-2xl bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/40 hover:bg-primary/5 transition-all">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[8px] text-muted-foreground font-medium">رفع</span>
                    </button>
                  )}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">شعار المتجر</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">PNG أو SVG - الحد الأقصى 2MB</p>
                  </div>
                </div>
              </SectionCard>

              {/* Store Info */}
              <SectionCard title="بيانات المتجر" icon={Type}>
                <div className="space-y-3">
                  <FieldInput label="اسم المتجر" value={config.storeName} onChange={v => updateConfig({ storeName: v })} placeholder="اكتب اسم متجرك" />
                  <FieldInput label="الشعار النصي (Tagline)" value={config.tagline} onChange={v => updateConfig({ tagline: v })} placeholder="عبارة تعريفية قصيرة" />
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">وصف المتجر</Label>
                    <Textarea value={config.storeDescription} onChange={e => updateConfig({ storeDescription: e.target.value })}
                      rows={3} className="text-sm resize-none rounded-xl" placeholder="وصف مختصر يظهر للزوار" />
                    <p className="text-[9px] text-muted-foreground">{config.storeDescription.length}/200 حرف</p>
                  </div>
                </div>
              </SectionCard>

              {/* Hero Buttons */}
              <SectionCard title="أزرار الصفحة الرئيسية" icon={Zap}>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput label="الزر الرئيسي" value={config.heroButtonText} onChange={v => updateConfig({ heroButtonText: v })} />
                    <FieldInput label="الزر الثانوي" value={config.heroSecondaryButton} onChange={v => updateConfig({ heroSecondaryButton: v })} />
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-center gap-3">
                    <div className="px-5 py-2.5 rounded-xl text-[11px] font-bold text-white shadow-sm" style={{ backgroundColor: activeColors.primary }}>{config.heroButtonText}</div>
                    <div className="px-5 py-2.5 rounded-xl border text-[11px] font-medium text-foreground" style={{ borderColor: `${activeColors.text}20` }}>{config.heroSecondaryButton}</div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* DESIGN TAB */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "design" && (
            <div className="space-y-4">
              {/* Color Presets */}
              <SectionCard title="لوحة الألوان" icon={Palette}>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PRESETS.map((preset, i) => {
                      const isSelected = !config.useCustomColors && config.selectedPreset === i;
                      return (
                        <button key={i} onClick={() => updateConfig({ selectedPreset: i, useCustomColors: false, colors: { ...preset } })}
                          className={`relative rounded-xl p-2.5 border-2 transition-all ${
                            isSelected ? "border-primary shadow-md scale-[1.02]" : "border-border hover:border-muted-foreground/30"
                          }`}>
                          {isSelected && (
                            <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                          <div className="flex gap-1 justify-center mb-2">
                            <div className="w-5 h-5 rounded-full shadow-sm ring-1 ring-border" style={{ backgroundColor: preset.primary }} />
                            <div className="w-5 h-5 rounded-full shadow-sm ring-1 ring-border" style={{ backgroundColor: preset.accent }} />
                          </div>
                          <div className="w-full h-4 rounded-md mb-1" style={{ backgroundColor: preset.bg, border: `1px solid ${preset.text}15` }}>
                            <div className="w-2/3 h-1 rounded-full mt-1.5 mx-auto" style={{ backgroundColor: preset.text }} />
                          </div>
                          <p className="text-[9px] font-bold text-foreground mt-1">{COLOR_PRESET_NAMES[i]}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Colors Toggle */}
                  <div className="border-t border-border/50 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground">ألوان مخصصة</span>
                      </div>
                      <Switch checked={config.useCustomColors} onCheckedChange={v => updateConfig({ useCustomColors: v })} />
                    </div>

                    {config.useCustomColors && (
                      <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
                        <ColorPicker label="الرئيسي" value={config.colors.primary} onChange={v => updateConfig({ colors: { ...config.colors, primary: v } })} />
                        <ColorPicker label="الثانوي" value={config.colors.accent} onChange={v => updateConfig({ colors: { ...config.colors, accent: v } })} />
                        <ColorPicker label="الخلفية" value={config.colors.bg} onChange={v => updateConfig({ colors: { ...config.colors, bg: v } })} />
                        <ColorPicker label="النصوص" value={config.colors.text} onChange={v => updateConfig({ colors: { ...config.colors, text: v } })} />
                      </div>
                    )}
                  </div>

                  {/* Live Preview */}
                  <div className="rounded-xl overflow-hidden border border-border">
                    <div className="p-4" style={{ backgroundColor: activeColors.bg }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: activeColors.primary }}>
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold" style={{ color: activeColors.text }}>معاينة الألوان</p>
                          <p className="text-[10px]" style={{ color: `${activeColors.text}66` }}>هكذا ستظهر ألوان متجرك</p>
                        </div>
                        <div className="px-4 py-2 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: activeColors.accent }}>زر</div>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Fonts */}
              <SectionCard title="الخطوط" icon={Type}>
                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">خط العناوين</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {FONT_OPTIONS.map(font => (
                        <button key={font.value} onClick={() => updateConfig({ headingFont: font.value })}
                          className={`p-2.5 rounded-xl border-2 transition-all text-center ${
                            config.headingFont === font.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                          }`}>
                          <p className="text-sm font-bold text-foreground leading-tight" style={{ fontFamily: font.value }}>{font.label}</p>
                          <p className="text-[8px] text-muted-foreground mt-0.5" style={{ fontFamily: font.value }}>{font.preview}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">خط النصوص</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {FONT_OPTIONS.map(font => (
                        <button key={font.value} onClick={() => updateConfig({ bodyFont: font.value })}
                          className={`p-2 rounded-xl border-2 transition-all text-center ${
                            config.bodyFont === font.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                          }`}>
                          <p className="text-xs font-medium text-foreground" style={{ fontFamily: font.value }}>{font.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">حجم الخط الأساسي</Label>
                      <span className="text-sm font-bold text-primary bg-primary/10 rounded-lg px-2.5 py-0.5">{config.baseFontSize}px</span>
                    </div>
                    <input type="range" min="13" max="20" value={config.baseFontSize}
                      onChange={e => updateConfig({ baseFontSize: e.target.value })}
                      className="w-full accent-[hsl(var(--primary))] h-2" />
                    <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                      <span>صغير</span><span>متوسط</span><span>كبير</span>
                    </div>
                  </div>

                  {/* Font Preview */}
                  <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                    <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">معاينة</p>
                    <p className="font-bold leading-tight" style={{
                      fontFamily: config.headingFont,
                      fontSize: `${Math.min(Number(config.baseFontSize) + 6, 26)}px`,
                      color: activeColors.text
                    }}>
                      عنوان تجريبي للمعاينة
                    </p>
                    <p className="leading-relaxed" style={{
                      fontFamily: config.bodyFont,
                      fontSize: `${config.baseFontSize}px`,
                      color: `${activeColors.text}99`
                    }}>
                      هذا نص تجريبي يوضح كيف سيظهر المحتوى بالخط والحجم المحددين. قم بتعديل الإعدادات وشاهد النتيجة فوراً.
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* SECTIONS TAB */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "sections" && (
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{enabledCount} قسم مفعّل</p>
                    <p className="text-[10px] text-muted-foreground">اسحب لإعادة الترتيب</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowAddSection(!showAddSection)}
                  className="h-9 gap-1.5 text-xs rounded-xl border-dashed border-primary/30 text-primary hover:bg-primary/5">
                  <Plus className="h-3.5 w-3.5" /> إضافة
                </Button>
              </div>

              {/* Add Section Panel */}
              {showAddSection && (
                <div className="bg-card border border-primary/20 rounded-2xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5 text-primary" /> أقسام جاهزة
                    </h3>
                    <button onClick={() => setShowAddSection(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SECTION_TEMPLATES.filter(t => !config.sections.find(s => s.id === t.id)).map(template => {
                      const TIcon = getIconComponent(template.icon);
                      return (
                        <button key={template.id} onClick={() => addNewSection(template)}
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-all text-right">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${template.color}15` }}>
                            <TIcon className="h-4 w-4" style={{ color: template.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground">{template.label}</p>
                            <p className="text-[9px] text-muted-foreground truncate">{template.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                    {SECTION_TEMPLATES.filter(t => !config.sections.find(s => s.id === t.id)).length === 0 && (
                      <p className="col-span-2 text-center text-xs text-muted-foreground py-4">تمت إضافة جميع الأقسام المتاحة</p>
                    )}
                  </div>
                </div>
              )}

              {/* Section List */}
              <div className="space-y-2">
                {config.sections.map((section, idx) => {
                  const Icon = getIconComponent(section.icon);
                  const isEditing = editingSection === section.id;
                  return (
                    <div key={section.id}
                      className={`bg-card rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isEditing ? "border-primary/50 shadow-lg shadow-primary/5"
                          : section.enabled ? "border-border" : "border-border/40 opacity-50"
                      }`}>
                      {/* Section Header */}
                      <div className="flex items-center gap-2.5 p-3">
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-0.5 flex-shrink-0">
                          <button onClick={() => moveSection(section.id, -1)} disabled={idx === 0}
                            className="w-6 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 transition-all">
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button onClick={() => moveSection(section.id, 1)} disabled={idx === config.sections.length - 1}
                            className="w-6 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 transition-all">
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!section.enabled ? 'bg-muted' : ''}`}
                          style={section.enabled ? { backgroundColor: `${section.color}12` } : undefined}>
                          <Icon className={`h-4 w-4 ${!section.enabled ? 'text-muted-foreground' : ''}`}
                            style={section.enabled ? { color: section.color } : undefined} />
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0" onClick={() => setEditingSection(isEditing ? null : section.id)}>
                          <p className="text-[13px] font-semibold text-foreground truncate cursor-pointer">{section.label}</p>
                          <p className="text-[9px] text-muted-foreground truncate">{section.subtitle}</p>
                        </div>

                        {/* Toggle */}
                        <Switch checked={section.enabled} onCheckedChange={() => toggleSection(section.id)} className="flex-shrink-0" />
                      </div>

                      {/* Expanded Edit Panel */}
                      {isEditing && (
                        <div className="border-t border-border/50 p-3 space-y-3 bg-muted/10 animate-in slide-in-from-top-1 duration-150">
                          <div className="grid grid-cols-2 gap-2">
                            <FieldInput label="اسم القسم" value={section.label} onChange={v => updateSectionLabel(section.id, v)} />
                            <FieldInput label="الوصف" value={section.subtitle} onChange={v => updateSectionSubtitle(section.id, v)} />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => duplicateSection(section.id)}
                              className="flex-1 h-8 gap-1.5 text-[11px] rounded-xl">
                              <Copy className="h-3 w-3" /> نسخ
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => removeSection(section.id)}
                              className="h-8 gap-1.5 text-[11px] rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30">
                              <Trash2 className="h-3 w-3" /> حذف
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Section Order Preview */}
              <div className="bg-muted/30 rounded-2xl p-3">
                <p className="text-[9px] font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Eye className="h-3 w-3" /> ترتيب الظهور في المتجر
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {config.sections.filter(s => s.enabled).map((section, idx) => (
                    <span key={section.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card border border-border text-[10px] font-medium text-foreground">
                      <span className="text-[8px] text-muted-foreground">{idx + 1}.</span> {section.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* CONTENT TAB */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "content" && (
            <div className="space-y-3">
              {/* Info Banner */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
                <AlertCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <p className="text-[10px] text-primary">عدّل محتوى كل قسم مفعّل من هنا. الأقسام المعطّلة لن تظهر.</p>
              </div>

              {/* Services */}
              {config.sections.find(s => s.id === "services")?.enabled && (
                <ContentSection
                  title="الخدمات" icon={Sparkles} count={config.services.length}
                  expanded={expandedContent === "services"}
                  onToggle={() => setExpandedContent(expandedContent === "services" ? null : "services")}
                  onAdd={addService}
                >
                  <div className="space-y-2">
                    {config.services.map((service, i) => {
                      const SIcon = getIconComponent(service.icon);
                      return (
                        <div key={i} className="bg-background rounded-xl p-3 border border-border/50 space-y-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <SIcon className="h-4 w-4 text-primary" />
                            </div>
                            <Input value={service.title} onChange={e => updateService(i, "title", e.target.value)}
                              className="flex-1 h-8 text-xs rounded-lg" placeholder="اسم الخدمة" />
                            <button onClick={() => removeService(i)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <Input value={service.desc} onChange={e => updateService(i, "desc", e.target.value)}
                            className="h-8 text-xs rounded-lg" placeholder="وصف مختصر للخدمة" />
                          <div className="flex gap-1 flex-wrap">
                            {ICON_OPTIONS.map(opt => (
                              <button key={opt.value} onClick={() => updateService(i, "icon", opt.value)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                  service.icon === opt.value ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-primary/10"
                                }`} title={opt.label}>
                                <opt.Icon className="h-3 w-3" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ContentSection>
              )}

              {/* Works / Portfolio */}
              {config.sections.find(s => s.id === "works")?.enabled && (
                <ContentSection
                  title="معرض الأعمال" icon={Image} count={config.works.length}
                  expanded={expandedContent === "works"}
                  onToggle={() => setExpandedContent(expandedContent === "works" ? null : "works")}
                  onAdd={addWork}
                >
                  <div className="space-y-2">
                    {config.works.map((work, i) => (
                      <div key={i} className="bg-background rounded-xl p-3 border border-border/50 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${activeColors.primary}20, ${activeColors.accent}15)` }}>
                            <PenTool className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <Input value={work.title} onChange={e => updateWork(i, "title", e.target.value)}
                              className="h-7 text-xs rounded-lg" placeholder="اسم المشروع" />
                            <Input value={work.category} onChange={e => updateWork(i, "category", e.target.value)}
                              className="h-7 text-[10px] rounded-lg" placeholder="التصنيف (مثال: تصميم)" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <button onClick={() => setEditingWorkIdx(editingWorkIdx === i ? null : i)}
                              className={`p-1.5 rounded-lg transition-colors ${editingWorkIdx === i ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                              <Link2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => removeWork(i)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        {/* Link field (expandable) */}
                        {editingWorkIdx === i && (
                          <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-150">
                            <Link2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <Input value={work.link || ""} onChange={e => updateWork(i, "link", e.target.value)}
                              className="h-7 text-[10px] rounded-lg" placeholder="https://behance.net/project" dir="ltr" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ContentSection>
              )}

              {/* Testimonials */}
              {config.sections.find(s => s.id === "testimonials")?.enabled && (
                <ContentSection
                  title="آراء العملاء" icon={Quote} count={config.testimonials.length}
                  expanded={expandedContent === "testimonials"}
                  onToggle={() => setExpandedContent(expandedContent === "testimonials" ? null : "testimonials")}
                  onAdd={addTestimonial}
                >
                  <div className="space-y-2">
                    {config.testimonials.map((t, i) => (
                      <div key={i} className="bg-background rounded-xl p-3 border border-border/50 space-y-2">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ backgroundColor: `${activeColors.primary}15`, color: activeColors.primary }}>
                            {t.name[0]}
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <div className="flex gap-2">
                              <Input value={t.name} onChange={e => updateTestimonial(i, "name", e.target.value)}
                                className="flex-1 h-7 text-xs rounded-lg" placeholder="الاسم" />
                              <Input value={t.role} onChange={e => updateTestimonial(i, "role", e.target.value)}
                                className="flex-1 h-7 text-xs rounded-lg" placeholder="المنصب" />
                            </div>
                          </div>
                          <button onClick={() => removeTestimonial(i)} className="text-muted-foreground hover:text-destructive p-1">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Textarea value={t.text} onChange={e => updateTestimonial(i, "text", e.target.value)}
                          className="text-xs min-h-[50px] rounded-lg resize-none" placeholder="نص الرأي أو الشهادة" />
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-muted-foreground ml-1">التقييم:</span>
                          {[1, 2, 3, 4, 5].map(s => (
                            <button key={s} onClick={() => updateTestimonial(i, "rating", s)} className="p-0.5">
                              <Star className={`h-4 w-4 transition-colors ${s <= t.rating ? "text-amber-400 fill-amber-400" : "text-border"}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ContentSection>
              )}

              {/* CTA */}
              {config.sections.find(s => s.id === "cta")?.enabled && (
                <ContentSection
                  title="دعوة للإجراء (CTA)" icon={Zap}
                  expanded={expandedContent === "cta"}
                  onToggle={() => setExpandedContent(expandedContent === "cta" ? null : "cta")}
                >
                  <div className="space-y-3">
                    <FieldInput label="العنوان" value={config.ctaTitle} onChange={v => updateConfig({ ctaTitle: v })} />
                    <FieldInput label="الوصف" value={config.ctaDesc} onChange={v => updateConfig({ ctaDesc: v })} />
                    <FieldInput label="نص الزر" value={config.ctaButton} onChange={v => updateConfig({ ctaButton: v })} />
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: `${activeColors.primary}08` }}>
                      <p className="text-sm font-bold mb-1" style={{ color: activeColors.text }}>{config.ctaTitle}</p>
                      <p className="text-[10px] mb-3" style={{ color: `${activeColors.text}66` }}>{config.ctaDesc}</p>
                      <div className="inline-block px-5 py-2 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: activeColors.primary }}>{config.ctaButton}</div>
                    </div>
                  </div>
                </ContentSection>
              )}

              {/* About */}
              {config.sections.find(s => s.id === "about")?.enabled && (
                <ContentSection
                  title="من نحن" icon={Globe}
                  expanded={expandedContent === "about"}
                  onToggle={() => setExpandedContent(expandedContent === "about" ? null : "about")}
                >
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">نص التعريف</Label>
                      <Textarea value={config.aboutText} onChange={e => updateConfig({ aboutText: e.target.value })}
                        rows={3} className="text-xs rounded-lg resize-none" placeholder="اكتب نبذة تعريفية عنك أو عن فريقك" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs text-muted-foreground">المميزات</Label>
                        <button onClick={addAboutFeature} className="text-primary text-[10px] font-semibold flex items-center gap-0.5 hover:underline">
                          <Plus className="h-3 w-3" /> إضافة
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {config.aboutFeatures.map((f, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Award className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                            <Input value={f} onChange={e => {
                              const n = [...config.aboutFeatures]; n[i] = e.target.value; updateConfig({ aboutFeatures: n });
                            }} className="h-8 text-xs rounded-lg flex-1" />
                            <button onClick={() => removeAboutFeature(i)} className="text-muted-foreground hover:text-destructive p-1">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ContentSection>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* CONTACT TAB */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "contact" && (
            <div className="space-y-4">
              <SectionCard title="معلومات التواصل" icon={Phone}>
                <div className="space-y-2">
                  <ContactInput icon={Mail} label="البريد الإلكتروني" value={config.contactEmail} onChange={v => updateConfig({ contactEmail: v })} dir="ltr" placeholder="hello@example.com" />
                  <ContactInput icon={Phone} label="رقم الهاتف" value={config.contactPhone} onChange={v => updateConfig({ contactPhone: v })} dir="ltr" placeholder="+964 xxx xxx xxxx" />
                  <ContactInput icon={MessageCircle} label="واتساب (اختياري)" value={config.whatsappNumber} onChange={v => updateConfig({ whatsappNumber: v })} dir="ltr" placeholder="+964xxxxxxxxxx" />
                  <ContactInput icon={Instagram} label="انستقرام" value={config.contactInstagram} onChange={v => updateConfig({ contactInstagram: v })} dir="ltr" placeholder="@username" />
                  <ContactInput icon={Globe} label="الموقع الإلكتروني" value={config.contactWebsite} onChange={v => updateConfig({ contactWebsite: v })} dir="ltr" placeholder="www.example.com" />
                </div>
              </SectionCard>

              {/* Social Preview */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <p className="text-[10px] font-semibold text-muted-foreground mb-3">معاينة روابط التواصل</p>
                <div className="flex items-center justify-center gap-3">
                  {[
                    { icon: Mail, active: !!config.contactEmail },
                    { icon: Phone, active: !!config.contactPhone },
                    { icon: MessageCircle, active: !!config.whatsappNumber },
                    { icon: Instagram, active: !!config.contactInstagram },
                    { icon: Globe, active: !!config.contactWebsite },
                  ].map((item, i) => (
                    <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      item.active ? 'bg-primary/10' : 'bg-muted/50'
                    }`}>
                      <item.icon className={`h-4 w-4 ${item.active ? 'text-primary' : 'text-muted-foreground/30'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══ STICKY ACTION BAR ═══ */}
        <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-30">
          <div className="flex gap-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-2 shadow-2xl shadow-foreground/5">
            <Button onClick={handleSave} className="flex-1 h-11 gap-2 text-sm rounded-xl font-semibold">
              <Save className="h-4 w-4" /> حفظ التغييرات
            </Button>
            <Button onClick={handlePreview} variant="outline" className="h-11 gap-2 text-sm rounded-xl px-4 font-semibold">
              <Eye className="h-4 w-4" /> معاينة
            </Button>
            <Button onClick={handleReset} variant="ghost" className="h-11 w-11 p-0 rounded-xl text-muted-foreground hover:text-destructive" title="إعادة تعيين">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════
// REUSABLE SUB-COMPONENTS
// ═══════════════════════════════════════

const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/20">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const FieldInput = ({ label, value, onChange, placeholder, dir }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; dir?: string;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir} className="rounded-xl" />
  </div>
);

const ContactInput = ({ icon: Icon, label, value, onChange, placeholder, dir }: {
  icon: React.ElementType; label: string; value: string; onChange: (v: string) => void; placeholder?: string; dir?: string;
}) => (
  <div className="flex items-center gap-3 bg-muted/20 rounded-xl p-3 hover:bg-muted/30 transition-colors">
    <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex-1 space-y-1">
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir}
        className="h-8 text-xs border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none" />
    </div>
  </div>
);

const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] text-muted-foreground">{label}</Label>
    <div className="flex items-center gap-2 bg-muted/20 rounded-xl p-1.5">
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent" />
      <Input value={value} onChange={e => onChange(e.target.value)}
        className="h-7 text-[10px] font-mono border-0 bg-transparent p-0 px-1 focus-visible:ring-0 focus-visible:ring-offset-0" dir="ltr" />
    </div>
  </div>
);

const ContentSection = ({
  title, icon: Icon, count, expanded, onToggle, onAdd, children,
}: {
  title: string; icon: React.ElementType; count?: number;
  expanded: boolean; onToggle: () => void; onAdd?: () => void; children: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden">
    <button onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-right hover:bg-muted/20 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {count !== undefined && <p className="text-[10px] text-muted-foreground">{count} عنصر</p>}
      </div>
      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
    </button>
    {expanded && (
      <div className="border-t border-border/50 p-3 space-y-3 bg-muted/10 animate-in slide-in-from-top-2 duration-200">
        {children}
        {onAdd && (
          <button onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all text-xs font-medium">
            <Plus className="h-3.5 w-3.5" /> إضافة عنصر جديد
          </button>
        )}
      </div>
    )}
  </div>
);

export default TemplateEditor;
