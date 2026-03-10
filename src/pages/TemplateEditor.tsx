import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette, Type, Image, Layout, Eye, Save, Sparkles,
  Globe, Instagram, Phone, Mail, MessageCircle,
  Plus, X, Monitor, Trash2, Edit3,
  ChevronDown, ChevronUp, Upload, Star, Quote,
  Briefcase, Award, Zap, Heart,
  PenTool, Camera, Code, ShoppingBag, FileText,
  GripVertical, RotateCcw, Copy, EyeOff, Layers,
  ArrowUp, ArrowDown, Settings2, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";

// ═══════════════════════════════════════
// TYPES
// ═══════════════════════════════════════

interface SectionConfig {
  id: string;
  label: string;
  enabled: boolean;
  icon: React.ElementType;
  subtitle: string;
  editable?: boolean;
  color: string;
}

interface ServiceItem { icon: string; title: string; desc: string; }
interface WorkItem { title: string; category: string; image?: string; }
interface TestimonialItem { name: string; role: string; text: string; rating: number; }

type TabId = "sections" | "brand" | "style" | "content" | "contact";

// ═══════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════

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
  { id: "faq", label: "الأسئلة الشائعة", icon: MessageCircle, subtitle: "أجوبة على الأسئلة المتكررة", color: "hsl(var(--accent))" },
  { id: "stats", label: "إحصائيات", icon: Award, subtitle: "أرقام وإنجازات بارزة", color: "hsl(var(--success))" },
  { id: "pricing", label: "الأسعار", icon: ShoppingBag, subtitle: "جدول تسعير المنتجات", color: "hsl(var(--primary))" },
  { id: "gallery", label: "معرض صور", icon: Camera, subtitle: "صور ومشاهد بصرية", color: "hsl(var(--destructive))" },
  { id: "partners", label: "الشركاء", icon: Briefcase, subtitle: "شعارات العملاء والشركاء", color: "hsl(var(--muted-foreground))" },
];

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "hero", label: "البطل الرئيسي", enabled: true, icon: Layout, subtitle: "العنوان والوصف وأزرار الإجراء", editable: true, color: "hsl(var(--primary))" },
  { id: "services", label: "الخدمات", enabled: true, icon: Sparkles, subtitle: "عرض خدماتك ومهاراتك", editable: true, color: "hsl(var(--accent))" },
  { id: "works", label: "معرض الأعمال", enabled: true, icon: Image, subtitle: "نماذج من أعمالك", editable: true, color: "hsl(var(--success))" },
  { id: "store", label: "المتجر", enabled: true, icon: Monitor, subtitle: "المنتجات الرقمية", color: "hsl(var(--primary))" },
  { id: "testimonials", label: "آراء العملاء", enabled: true, icon: Quote, subtitle: "تقييمات وشهادات", editable: true, color: "hsl(var(--accent))" },
  { id: "cta", label: "دعوة للإجراء", enabled: true, icon: Zap, subtitle: "قسم تحفيزي", editable: true, color: "hsl(var(--destructive))" },
  { id: "about", label: "من نحن", enabled: true, icon: Globe, subtitle: "تعريف بك أو بفريقك", editable: true, color: "hsl(var(--muted-foreground))" },
];

const COLOR_PRESETS = [
  { name: "تيركوازي", primary: "#0EA5E9", accent: "#06B6D4", bg: "#FFFFFF", text: "#1a2332" },
  { name: "بنفسجي", primary: "#8B5CF6", accent: "#A78BFA", bg: "#FFFFFF", text: "#1a1a2e" },
  { name: "أخضر", primary: "#10B981", accent: "#34D399", bg: "#FFFFFF", text: "#1a2e1a" },
  { name: "برتقالي", primary: "#F97316", accent: "#FB923C", bg: "#FFFFFF", text: "#2e1a0c" },
  { name: "وردي", primary: "#EC4899", accent: "#F472B6", bg: "#FFFFFF", text: "#2e1a24" },
  { name: "داكن", primary: "#6366F1", accent: "#818CF8", bg: "#0F172A", text: "#F1F5F9" },
  { name: "ذهبي", primary: "#D4AF37", accent: "#F0D060", bg: "#1A1A1A", text: "#FAFAFA" },
  { name: "أحمر", primary: "#EF4444", accent: "#F87171", bg: "#FFFFFF", text: "#1a1a1a" },
];

const FONT_OPTIONS = [
  { value: "IBM Plex Sans Arabic", label: "IBM Plex", preview: "نص عربي احترافي" },
  { value: "Cairo", label: "القاهرة", preview: "خط القاهرة الحديث" },
  { value: "Tajawal", label: "تجوّل", preview: "خط تجول الأنيق" },
  { value: "Almarai", label: "المرعي", preview: "خط المرعي الواضح" },
  { value: "Noto Sans Arabic", label: "نوتو", preview: "خط نوتو العالمي" },
  { value: "Rubik", label: "روبيك", preview: "خط روبيك العصري" },
];

// ═══════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════

const TemplateEditor = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("sections");
  const [showAddSection, setShowAddSection] = useState(false);
  const [movingSection, setMovingSection] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);

  // Brand
  const [storeName, setStoreName] = useState("استوديو إبداع");
  const [tagline, setTagline] = useState("نصنع تجارب رقمية تُلهم");
  const [storeDescription, setStoreDescription] = useState("دورات تعليمية، أدوات تصميم، وخدمات إبداعية.");
  const [heroButtonText, setHeroButtonText] = useState("تصفح المتجر");
  const [heroSecondaryButton, setHeroSecondaryButton] = useState("شاهد أعمالنا");
  const [logoImage, setLogoImage] = useState<string | null>(null);

  // Style
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customPrimary, setCustomPrimary] = useState(COLOR_PRESETS[0].primary);
  const [customAccent, setCustomAccent] = useState(COLOR_PRESETS[0].accent);
  const [customBg, setCustomBg] = useState(COLOR_PRESETS[0].bg);
  const [customText, setCustomText] = useState(COLOR_PRESETS[0].text);
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [headingFont, setHeadingFont] = useState("IBM Plex Sans Arabic");
  const [bodyFont, setBodyFont] = useState("IBM Plex Sans Arabic");
  const [baseFontSize, setBaseFontSize] = useState("16");

  // Sections
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);

  // Content
  const [services, setServices] = useState<ServiceItem[]>([
    { icon: "Palette", title: "تصميم جرافيك", desc: "هويات بصرية وشعارات احترافية" },
    { icon: "Monitor", title: "تصميم واجهات", desc: "UI/UX لتطبيقات الموبايل والويب" },
    { icon: "Code", title: "تطوير ويب", desc: "مواقع ومتاجر بأحدث التقنيات" },
  ]);
  const [works, setWorks] = useState<WorkItem[]>([
    { title: "هوية بصرية لمطعم", category: "هوية بصرية" },
    { title: "تطبيق توصيل", category: "تصميم واجهات" },
    { title: "موقع عقارات", category: "تطوير ويب" },
  ]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    { name: "سارة أحمد", role: "مديرة تسويق", text: "تجربة رائعة غيّرت مساري المهني!", rating: 5 },
    { name: "محمد علي", role: "مطور مستقل", text: "أفضل محتوى عربي والدعم ممتاز.", rating: 5 },
  ]);
  const [ctaTitle, setCtaTitle] = useState("مستعد للبدء؟");
  const [ctaDesc, setCtaDesc] = useState("انضم لآلاف العملاء الذين يثقون بنا.");
  const [ctaButton, setCtaButton] = useState("تصفح المنتجات");
  const [aboutText, setAboutText] = useState("فريق من المبدعين نؤمن بأن كل شخص يستحق محتوى رقمي عربي عالي الجودة.");
  const [aboutFeatures, setAboutFeatures] = useState(["+٥ سنوات خبرة", "تسليم فوري", "ضمان الجودة"]);

  // Contact
  const [contactEmail, setContactEmail] = useState("hello@studio.com");
  const [contactPhone, setContactPhone] = useState("+964 770 123 4567");
  const [contactInstagram, setContactInstagram] = useState("@studio_iq");
  const [contactWebsite, setContactWebsite] = useState("www.studio.com");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
      const next = [...prev];
      [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
      return next;
    });
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    toast({ title: "تم حذف القسم" });
  };

  const duplicateSection = (id: string) => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      const section = prev[idx];
      const newSection = { ...section, id: `${section.id}-copy-${Date.now()}`, label: `${section.label} (نسخة)` };
      const next = [...prev];
      next.splice(idx + 1, 0, newSection);
      return next;
    });
    toast({ title: "تم نسخ القسم" });
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
    setSections(prev => [...prev, newSection]);
    setShowAddSection(false);
    toast({ title: `تم إضافة قسم "${template.label}"` });
  };

  const addService = () => setServices(prev => [...prev, { icon: "Sparkles", title: "خدمة جديدة", desc: "وصف الخدمة" }]);
  const removeService = (i: number) => setServices(prev => prev.filter((_, idx) => idx !== i));
  const updateService = (i: number, field: keyof ServiceItem, value: string) => {
    setServices(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const addWork = () => setWorks(prev => [...prev, { title: "مشروع جديد", category: "تصنيف" }]);
  const removeWork = (i: number) => setWorks(prev => prev.filter((_, idx) => idx !== i));
  const updateWork = (i: number, field: keyof WorkItem, value: string) => {
    setWorks(prev => prev.map((w, idx) => idx === i ? { ...w, [field]: value } : w));
  };

  const addTestimonial = () => setTestimonials(prev => [...prev, { name: "عميل جديد", role: "الوظيفة", text: "رأي العميل...", rating: 5 }]);
  const removeTestimonial = (i: number) => setTestimonials(prev => prev.filter((_, idx) => idx !== i));
  const updateTestimonial = (i: number, field: keyof TestimonialItem, value: string | number) => {
    setTestimonials(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };

  const getIconComponent = (iconName: string) => ICON_OPTIONS.find(o => o.value === iconName)?.Icon || Sparkles;

  const handleSave = () => toast({ title: "تم الحفظ ✓", description: "تم حفظ جميع التغييرات بنجاح" });
  const handlePreview = () => {
    const w = 1200, h = 800;
    const left = (screen.width - w) / 2, top = (screen.height - h) / 2;
    window.open("/storefront", "storefront", `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`);
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "sections", label: "الأقسام", icon: Layers },
    { id: "brand", label: "الهوية", icon: Type },
    { id: "style", label: "الستايل", icon: Palette },
    { id: "content", label: "المحتوى", icon: Edit3 },
    { id: "contact", label: "التواصل", icon: Phone },
  ];

  const enabledCount = sections.filter(s => s.enabled).length;

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="تخصيص القالب" subtitle="صمم متجرك كما تريد" />

      <main className="container mx-auto max-w-lg px-4">
        {/* Tab Bar - Pill Style */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl pb-3 pt-1 -mx-4 px-4">
          <div className="flex gap-1 bg-muted/60 p-1 rounded-2xl">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-semibold transition-all ${
                    isActive
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden min-[400px]:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 mt-2">

          {/* ═══════════════════════════════════════ */}
          {/* SECTIONS TAB - Mobile-first drag-style */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "sections" && (
            <div className="space-y-3">
              {/* Section counter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{enabledCount} قسم مفعّل</p>
                    <p className="text-[10px] text-muted-foreground">من أصل {sections.length} قسم</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowAddSection(true)}
                  className="h-9 gap-1.5 text-xs rounded-xl border-dashed border-primary/30 text-primary hover:bg-primary/5">
                  <Plus className="h-3.5 w-3.5" /> قسم جديد
                </Button>
              </div>

              {/* Section list */}
              <div className="space-y-2">
                {sections.map((section, idx) => {
                  const Icon = section.icon;
                  const isMoving = movingSection === section.id;
                  return (
                    <div key={section.id}
                      className={`bg-card rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isMoving
                          ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                          : section.enabled
                            ? "border-border"
                            : "border-border/50 opacity-60"
                      }`}>
                      {/* Main row */}
                      <div className="flex items-center gap-3 p-3">
                        {/* Grip / Order */}
                        <button
                          onClick={() => setMovingSection(isMoving ? null : section.id)}
                          className={`w-8 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all flex-shrink-0 ${
                            isMoving ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground active:bg-primary/10"
                          }`}>
                          <GripVertical className="h-4 w-4" />
                          <span className="text-[8px] font-bold leading-none">{idx + 1}</span>
                        </button>

                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: section.enabled ? `${section.color}15` : undefined }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!section.enabled ? 'bg-muted' : ''}`}>
                          <Icon className="h-5 w-5" style={{ color: section.enabled ? section.color : undefined }}
                            className={`h-5 w-5 ${!section.enabled ? 'text-muted-foreground' : ''}`} />
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{section.label}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{section.subtitle}</p>
                        </div>

                        {/* Toggle */}
                        <Switch checked={section.enabled} onCheckedChange={() => toggleSection(section.id)} />
                      </div>

                      {/* Move controls - shown when tapped */}
                      {isMoving && (
                        <div className="flex items-center gap-2 px-3 pb-3 animate-slide-in">
                          <Button size="sm" variant="outline" disabled={idx === 0}
                            onClick={() => moveSection(section.id, -1)}
                            className="flex-1 h-9 gap-1.5 text-xs rounded-xl">
                            <ArrowUp className="h-3.5 w-3.5" /> أعلى
                          </Button>
                          <Button size="sm" variant="outline" disabled={idx === sections.length - 1}
                            onClick={() => moveSection(section.id, 1)}
                            className="flex-1 h-9 gap-1.5 text-xs rounded-xl">
                            <ArrowDown className="h-3.5 w-3.5" /> أسفل
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => duplicateSection(section.id)}
                            className="h-9 w-9 p-0 rounded-xl">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => removeSection(section.id)}
                            className="h-9 w-9 p-0 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add section panel */}
              {showAddSection && (
                <div className="bg-card border border-primary/20 rounded-2xl p-4 space-y-3 animate-slide-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Plus className="h-4 w-4 text-primary" /> إضافة قسم جديد
                    </h3>
                    <button onClick={() => setShowAddSection(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SECTION_TEMPLATES.filter(t => !sections.find(s => s.id === t.id)).map(template => {
                      const TIcon = template.icon;
                      return (
                        <button key={template.id} onClick={() => addNewSection(template)}
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-all text-right">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${template.color}15` }}>
                            <TIcon className="h-4 w-4" style={{ color: template.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground">{template.label}</p>
                            <p className="text-[9px] text-muted-foreground truncate">{template.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Visual preview of order */}
              <div className="bg-muted/40 rounded-2xl p-4">
                <p className="text-[10px] font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Smartphone className="h-3 w-3" /> ترتيب الأقسام في المتجر
                </p>
                <div className="space-y-1">
                  {sections.filter(s => s.enabled).map((section, idx) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.id} className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 border border-border/50">
                        <span className="text-[9px] font-bold text-muted-foreground w-4">{idx + 1}</span>
                        <Icon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] font-medium text-foreground">{section.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* BRAND TAB */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "brand" && (
            <div className="space-y-4">
              {/* Logo */}
              <EditorCard title="شعار المتجر" icon={Image}>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload(setLogoImage)} />
                <div className="flex items-center gap-4">
                  {logoImage ? (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border group">
                      <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
                      <button onClick={() => setLogoImage(null)}
                        className="absolute inset-0 bg-destructive/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-5 w-5 text-destructive-foreground" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => logoInputRef.current?.click()}
                      className="w-20 h-20 rounded-2xl bg-muted/60 border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/40 hover:bg-primary/5 transition-all">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground font-medium">رفع شعار</span>
                    </button>
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium text-foreground">شعار المتجر</p>
                    <p className="text-[10px] text-muted-foreground">PNG أو SVG بخلفية شفافة. الحد الأقصى 2MB</p>
                  </div>
                </div>
              </EditorCard>

              {/* Store info */}
              <EditorCard title="معلومات المتجر" icon={Type}>
                <div className="space-y-3">
                  <EditorField label="اسم المتجر" value={storeName} onChange={setStoreName} />
                  <EditorField label="الشعار النصي" value={tagline} onChange={setTagline} />
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">وصف المتجر</Label>
                    <Textarea value={storeDescription} onChange={e => setStoreDescription(e.target.value)}
                      rows={2} className="text-sm resize-none rounded-xl" />
                  </div>
                </div>
              </EditorCard>

              {/* Hero buttons */}
              <EditorCard title="أزرار البطل الرئيسي" icon={Zap}>
                <div className="grid grid-cols-2 gap-3">
                  <EditorField label="الزر الرئيسي" value={heroButtonText} onChange={setHeroButtonText} />
                  <EditorField label="الزر الثانوي" value={heroSecondaryButton} onChange={setHeroSecondaryButton} />
                </div>
                {/* Preview */}
                <div className="bg-muted/40 rounded-xl p-4 flex items-center justify-center gap-3 mt-3">
                  <div className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">{heroButtonText}</div>
                  <div className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-foreground">{heroSecondaryButton}</div>
                </div>
              </EditorCard>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* STYLE TAB (Colors + Fonts) */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "style" && (
            <div className="space-y-4">
              {/* Color presets */}
              <EditorCard title="سمة الألوان" icon={Palette}>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((preset, i) => (
                    <button key={i} onClick={() => { setSelectedPreset(i); setUseCustomColors(false); setCustomPrimary(preset.primary); setCustomAccent(preset.accent); setCustomBg(preset.bg); setCustomText(preset.text); }}
                      className={`rounded-xl p-2.5 border-2 transition-all ${
                        !useCustomColors && selectedPreset === i
                          ? "border-primary shadow-md bg-primary/5"
                          : "border-border hover:border-foreground/20"
                      }`}>
                      <div className="flex gap-1 justify-center mb-1.5">
                        <div className="w-6 h-6 rounded-full border border-border shadow-sm" style={{ backgroundColor: preset.primary }} />
                        <div className="w-6 h-6 rounded-full border border-border shadow-sm" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <p className="text-[9px] font-bold text-foreground">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </EditorCard>

              {/* Custom colors */}
              <EditorCard title="ألوان مخصصة" icon={Settings2}>
                <button onClick={() => setUseCustomColors(!useCustomColors)}
                  className={`w-full text-right text-xs font-medium px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                    useCustomColors ? "border-primary bg-primary/5 text-primary" : "border-dashed border-border text-muted-foreground hover:border-primary/30"
                  }`}>
                  <span>{useCustomColors ? "✓ الألوان المخصصة مفعّلة" : "تفعيل الألوان المخصصة"}</span>
                  <Palette className="h-4 w-4" />
                </button>
                {useCustomColors && (
                  <div className="grid grid-cols-2 gap-3 mt-3 animate-slide-in">
                    <ColorInput label="الرئيسي" value={customPrimary} onChange={setCustomPrimary} />
                    <ColorInput label="الثانوي" value={customAccent} onChange={setCustomAccent} />
                    <ColorInput label="الخلفية" value={customBg} onChange={setCustomBg} />
                    <ColorInput label="النصوص" value={customText} onChange={setCustomText} />
                  </div>
                )}
                {/* Live preview */}
                <div className="mt-3 rounded-xl overflow-hidden border border-border">
                  <div className="p-4 flex items-center gap-3" style={{ backgroundColor: useCustomColors ? customBg : COLOR_PRESETS[selectedPreset].bg }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: useCustomColors ? customPrimary : COLOR_PRESETS[selectedPreset].primary }}>
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: useCustomColors ? customText : COLOR_PRESETS[selectedPreset].text }}>معاينة حية</p>
                      <p className="text-[10px] opacity-50" style={{ color: useCustomColors ? customText : COLOR_PRESETS[selectedPreset].text }}>هذا شكل ألوان متجرك</p>
                    </div>
                    <div className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: useCustomColors ? customAccent : COLOR_PRESETS[selectedPreset].accent }}>
                      شراء
                    </div>
                  </div>
                </div>
              </EditorCard>

              {/* Fonts */}
              <EditorCard title="الخطوط" icon={Type}>
                <div className="space-y-3">
                  <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">خط العناوين</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {FONT_OPTIONS.map(font => (
                      <button key={font.value} onClick={() => setHeadingFont(font.value)}
                        className={`p-2.5 rounded-xl border-2 transition-all text-center ${
                          headingFont === font.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        }`}>
                        <p className="text-sm font-bold text-foreground" style={{ fontFamily: font.value }}>{font.label}</p>
                        <p className="text-[8px] text-muted-foreground mt-0.5" style={{ fontFamily: font.value }}>{font.preview}</p>
                      </button>
                    ))}
                  </div>

                  <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider pt-2">خط النصوص</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {FONT_OPTIONS.map(font => (
                      <button key={font.value} onClick={() => setBodyFont(font.value)}
                        className={`p-2.5 rounded-xl border-2 transition-all text-center ${
                          bodyFont === font.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        }`}>
                        <p className="text-xs font-bold text-foreground" style={{ fontFamily: font.value }}>{font.label}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">حجم الخط</Label>
                    <input type="range" min="13" max="20" value={baseFontSize} onChange={e => setBaseFontSize(e.target.value)}
                      className="flex-1 accent-[hsl(var(--primary))]" />
                    <span className="text-sm font-bold text-foreground bg-muted rounded-lg px-2.5 py-1 min-w-[45px] text-center">{baseFontSize}</span>
                  </div>
                </div>
              </EditorCard>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* CONTENT TAB */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "content" && (
            <div className="space-y-3">
              {/* Services */}
              {sections.find(s => s.id === "services")?.enabled && (
                <ContentAccordion
                  title="الخدمات"
                  icon={Sparkles}
                  count={services.length}
                  expanded={expandedContent === "services"}
                  onToggle={() => setExpandedContent(expandedContent === "services" ? null : "services")}
                  onAdd={addService}
                >
                  <div className="space-y-2">
                    {services.map((service, i) => {
                      const SIcon = getIconComponent(service.icon);
                      return (
                        <div key={i} className="bg-background rounded-xl p-3 border border-border/50 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <SIcon className="h-4 w-4 text-primary" />
                            </div>
                            <Input value={service.title} onChange={e => updateService(i, "title", e.target.value)} className="flex-1 h-8 text-xs rounded-lg" />
                            <button onClick={() => removeService(i)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                          <Input value={service.desc} onChange={e => updateService(i, "desc", e.target.value)} className="h-8 text-xs rounded-lg" placeholder="وصف" />
                          <div className="flex gap-1 flex-wrap">
                            {ICON_OPTIONS.slice(0, 8).map(opt => (
                              <button key={opt.value} onClick={() => updateService(i, "icon", opt.value)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                  service.icon === opt.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
                                }`}>
                                <opt.Icon className="h-3 w-3" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ContentAccordion>
              )}

              {/* Works */}
              {sections.find(s => s.id === "works")?.enabled && (
                <ContentAccordion
                  title="معرض الأعمال"
                  icon={Image}
                  count={works.length}
                  expanded={expandedContent === "works"}
                  onToggle={() => setExpandedContent(expandedContent === "works" ? null : "works")}
                  onAdd={addWork}
                >
                  <div className="space-y-2">
                    {works.map((work, i) => (
                      <div key={i} className="flex items-center gap-2 bg-background rounded-xl p-3 border border-border/50">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          <PenTool className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Input value={work.title} onChange={e => updateWork(i, "title", e.target.value)} className="h-7 text-xs rounded-lg" />
                          <Input value={work.category} onChange={e => updateWork(i, "category", e.target.value)} className="h-7 text-[10px] rounded-lg" />
                        </div>
                        <button onClick={() => removeWork(i)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </ContentAccordion>
              )}

              {/* Testimonials */}
              {sections.find(s => s.id === "testimonials")?.enabled && (
                <ContentAccordion
                  title="آراء العملاء"
                  icon={Quote}
                  count={testimonials.length}
                  expanded={expandedContent === "testimonials"}
                  onToggle={() => setExpandedContent(expandedContent === "testimonials" ? null : "testimonials")}
                  onAdd={addTestimonial}
                >
                  <div className="space-y-2">
                    {testimonials.map((t, i) => (
                      <div key={i} className="bg-background rounded-xl p-3 border border-border/50 space-y-2">
                        <div className="flex gap-2">
                          <Input value={t.name} onChange={e => updateTestimonial(i, "name", e.target.value)} className="flex-1 h-8 text-xs rounded-lg" placeholder="الاسم" />
                          <Input value={t.role} onChange={e => updateTestimonial(i, "role", e.target.value)} className="flex-1 h-8 text-xs rounded-lg" placeholder="الوظيفة" />
                          <button onClick={() => removeTestimonial(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                        <Textarea value={t.text} onChange={e => updateTestimonial(i, "text", e.target.value)} className="text-xs min-h-[50px] rounded-lg resize-none" />
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <button key={s} onClick={() => updateTestimonial(i, "rating", s)}>
                              <Star className={`h-4 w-4 transition-colors ${s <= t.rating ? "text-primary fill-primary" : "text-border"}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ContentAccordion>
              )}

              {/* CTA */}
              {sections.find(s => s.id === "cta")?.enabled && (
                <ContentAccordion
                  title="دعوة للإجراء"
                  icon={Zap}
                  expanded={expandedContent === "cta"}
                  onToggle={() => setExpandedContent(expandedContent === "cta" ? null : "cta")}
                >
                  <div className="space-y-3">
                    <EditorField label="العنوان" value={ctaTitle} onChange={setCtaTitle} />
                    <EditorField label="الوصف" value={ctaDesc} onChange={setCtaDesc} />
                    <EditorField label="نص الزر" value={ctaButton} onChange={setCtaButton} />
                  </div>
                </ContentAccordion>
              )}

              {/* About */}
              {sections.find(s => s.id === "about")?.enabled && (
                <ContentAccordion
                  title="من نحن"
                  icon={Globe}
                  expanded={expandedContent === "about"}
                  onToggle={() => setExpandedContent(expandedContent === "about" ? null : "about")}
                >
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">نص التعريف</Label>
                      <Textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows={3} className="text-xs rounded-lg resize-none" />
                    </div>
                    {aboutFeatures.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Award className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <Input value={f} onChange={e => { const n = [...aboutFeatures]; n[i] = e.target.value; setAboutFeatures(n); }} className="h-8 text-xs rounded-lg" />
                      </div>
                    ))}
                  </div>
                </ContentAccordion>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* CONTACT TAB */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "contact" && (
            <EditorCard title="معلومات التواصل" icon={Phone}>
              <div className="space-y-3">
                <ContactField icon={Mail} label="البريد الإلكتروني" value={contactEmail} onChange={setContactEmail} dir="ltr" />
                <ContactField icon={Phone} label="الهاتف" value={contactPhone} onChange={setContactPhone} dir="ltr" />
                <ContactField icon={MessageCircle} label="واتساب" value={whatsappNumber} onChange={setWhatsappNumber} placeholder="اختياري" dir="ltr" />
                <ContactField icon={Instagram} label="انستقرام" value={contactInstagram} onChange={setContactInstagram} dir="ltr" />
                <ContactField icon={Globe} label="الموقع" value={contactWebsite} onChange={setContactWebsite} dir="ltr" />
              </div>
            </EditorCard>
          )}
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* STICKY ACTION BAR */}
        {/* ═══════════════════════════════════════ */}
        <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-30">
          <div className="flex gap-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-2 shadow-2xl shadow-foreground/5">
            <Button onClick={handleSave} className="flex-1 h-11 gap-2 text-sm rounded-xl font-semibold">
              <Save className="h-4 w-4" /> حفظ
            </Button>
            <Button onClick={handlePreview} variant="outline" className="h-11 gap-2 text-sm rounded-xl px-5 font-semibold">
              <Eye className="h-4 w-4" /> معاينة
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════

const EditorCard = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const EditorField = ({ label, value, onChange, placeholder, dir }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; dir?: string }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir} className="rounded-xl" />
  </div>
);

const ContactField = ({ icon: Icon, label, value, onChange, placeholder, dir }: { icon: React.ElementType; label: string; value: string; onChange: (v: string) => void; placeholder?: string; dir?: string }) => (
  <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
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

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] text-muted-foreground">{label}</Label>
    <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-1.5">
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent" />
      <Input value={value} onChange={e => onChange(e.target.value)}
        className="h-7 text-[10px] font-mono border-0 bg-transparent p-0 px-1 focus-visible:ring-0 focus-visible:ring-offset-0" dir="ltr" />
    </div>
  </div>
);

const ContentAccordion = ({
  title, icon: Icon, count, expanded, onToggle, onAdd, children,
}: {
  title: string; icon: React.ElementType; count?: number;
  expanded: boolean; onToggle: () => void; onAdd?: () => void; children: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden">
    <button onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-right hover:bg-muted/30 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {count !== undefined && <p className="text-[10px] text-muted-foreground">{count} عنصر</p>}
      </div>
      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
    </button>
    {expanded && (
      <div className="border-t border-border/50 p-3 space-y-3 animate-slide-in bg-muted/20">
        {children}
        {onAdd && (
          <button onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all text-xs font-medium">
            <Plus className="h-3.5 w-3.5" /> إضافة عنصر
          </button>
        )}
      </div>
    )}
  </div>
);

export default TemplateEditor;
