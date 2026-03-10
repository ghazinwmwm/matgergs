import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette, Type, Image, Layout, Eye, Save, Sparkles,
  Globe, Instagram, Phone, Mail, MessageCircle,
  Plus, X, GripVertical, Monitor, Trash2, Edit3,
  ChevronDown, ChevronUp, Upload, Star, Quote,
  Briefcase, Award, Users, ShoppingBag, FileText,
  Layers, PenTool, Camera, Code, Zap, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
}

interface ServiceItem { icon: string; title: string; desc: string; }
interface WorkItem { title: string; category: string; }
interface TestimonialItem { name: string; role: string; text: string; rating: number; }

type TabId = "brand" | "colors" | "fonts" | "sections" | "content" | "contact";

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

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "hero", label: "الصفحة الرئيسية", enabled: true, icon: Layout, subtitle: "العنوان الرئيسي والوصف وأزرار الإجراء", editable: true },
  { id: "services", label: "الخدمات", enabled: true, icon: Sparkles, subtitle: "عرض الخدمات التي تقدمها", editable: true },
  { id: "works", label: "معرض الأعمال", enabled: true, icon: Image, subtitle: "نماذج من أعمالك ومشاريعك", editable: true },
  { id: "store", label: "المتجر", enabled: true, icon: Monitor, subtitle: "عرض المنتجات الرقمية للبيع" },
  { id: "testimonials", label: "آراء العملاء", enabled: true, icon: Quote, subtitle: "تقييمات وشهادات العملاء", editable: true },
  { id: "cta", label: "دعوة للإجراء", enabled: true, icon: Zap, subtitle: "قسم تحفيزي لجذب العملاء", editable: true },
  { id: "about", label: "من نحن", enabled: true, icon: Globe, subtitle: "معلومات عنك أو عن فريقك", editable: true },
];

const COLOR_PRESETS = [
  { name: "تيركوازي", primary: "#0EA5E9", accent: "#06B6D4", bg: "#FFFFFF", text: "#1a2332" },
  { name: "بنفسجي", primary: "#8B5CF6", accent: "#A78BFA", bg: "#FFFFFF", text: "#1a1a2e" },
  { name: "أخضر", primary: "#10B981", accent: "#34D399", bg: "#FFFFFF", text: "#1a2e1a" },
  { name: "برتقالي", primary: "#F97316", accent: "#FB923C", bg: "#FFFFFF", text: "#2e1a0c" },
  { name: "وردي", primary: "#EC4899", accent: "#F472B6", bg: "#FFFFFF", text: "#2e1a24" },
  { name: "داكن", primary: "#6366F1", accent: "#818CF8", bg: "#0F172A", text: "#F1F5F9" },
  { name: "ذهبي داكن", primary: "#D4AF37", accent: "#F0D060", bg: "#1A1A1A", text: "#FAFAFA" },
  { name: "أحمر", primary: "#EF4444", accent: "#F87171", bg: "#FFFFFF", text: "#1a1a1a" },
];

const FONT_OPTIONS = [
  { value: "IBM Plex Sans Arabic", label: "IBM Plex Arabic", sample: "خط عربي احترافي" },
  { value: "Cairo", label: "Cairo", sample: "خط القاهرة الحديث" },
  { value: "Tajawal", label: "Tajawal", sample: "خط تجول الأنيق" },
  { value: "Almarai", label: "Almarai", sample: "خط المرعي الواضح" },
  { value: "Noto Sans Arabic", label: "Noto Sans Arabic", sample: "خط نوتو المتعدد" },
  { value: "Rubik", label: "Rubik", sample: "خط روبيك العصري" },
  { value: "Inter", label: "Inter", sample: "Modern clean font" },
];

// ═══════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════

const TemplateEditor = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("brand");

  // Brand
  const [storeName, setStoreName] = useState("استوديو إبداع");
  const [tagline, setTagline] = useState("نصنع تجارب رقمية تُلهم وتُحقق النتائج");
  const [storeDescription, setStoreDescription] = useState("دورات تعليمية، أدوات تصميم، وخدمات إبداعية من فريق متخصص.");
  const [heroButtonText, setHeroButtonText] = useState("تصفح المتجر");
  const [heroSecondaryButton, setHeroSecondaryButton] = useState("شاهد أعمالنا");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [favIcon, setFavIcon] = useState<string | null>(null);

  // Colors
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customPrimary, setCustomPrimary] = useState(COLOR_PRESETS[0].primary);
  const [customAccent, setCustomAccent] = useState(COLOR_PRESETS[0].accent);
  const [customBg, setCustomBg] = useState(COLOR_PRESETS[0].bg);
  const [customText, setCustomText] = useState(COLOR_PRESETS[0].text);
  const [useCustomColors, setUseCustomColors] = useState(false);

  // Fonts
  const [headingFont, setHeadingFont] = useState("IBM Plex Sans Arabic");
  const [bodyFont, setBodyFont] = useState("IBM Plex Sans Arabic");
  const [baseFontSize, setBaseFontSize] = useState("16");

  // Sections
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Content - Services
  const [services, setServices] = useState<ServiceItem[]>([
    { icon: "Palette", title: "تصميم جرافيك", desc: "هويات بصرية، شعارات، ومطبوعات احترافية" },
    { icon: "Monitor", title: "تصميم واجهات", desc: "تصميم UI/UX لتطبيقات الموبايل والويب" },
    { icon: "Code", title: "تطوير ويب", desc: "مواقع ومتاجر إلكترونية بأحدث التقنيات" },
    { icon: "Camera", title: "تصوير احترافي", desc: "تصوير منتجات وفعاليات ومحتوى رقمي" },
  ]);

  // Content - Works
  const [works, setWorks] = useState<WorkItem[]>([
    { title: "هوية بصرية لمطعم فاخر", category: "هوية بصرية" },
    { title: "تطبيق موبايل للتوصيل", category: "تصميم واجهات" },
    { title: "موقع إلكتروني لشركة عقارات", category: "تطوير ويب" },
    { title: "حملة تسويقية لمنتج تقني", category: "تسويق رقمي" },
  ]);

  // Content - Testimonials
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    { name: "سارة أحمد", role: "مديرة تسويق", text: "تجربة رائعة! الدورة غيّرت مساري المهني بالكامل.", rating: 5 },
    { name: "محمد علي", role: "مطور مستقل", text: "أفضل محتوى عربي صادفته. الشرح واضح والدعم ممتاز.", rating: 5 },
    { name: "نور حسين", role: "مصممة", text: "القوالب وفرت عليّ ساعات من العمل. جودة عالية.", rating: 5 },
  ]);

  // Content - CTA
  const [ctaTitle, setCtaTitle] = useState("مستعد للبدء؟");
  const [ctaDesc, setCtaDesc] = useState("انضم لآلاف العملاء الذين يثقون بنا.");
  const [ctaButton, setCtaButton] = useState("تصفح المنتجات");

  // Content - About
  const [aboutText, setAboutText] = useState("نحن فريق من المبدعين والمطورين نؤمن بأن كل شخص يستحق الوصول لمحتوى رقمي عربي عالي الجودة.");
  const [aboutFeatures, setAboutFeatures] = useState(["+٥ سنوات خبرة", "تسليم فوري", "ضمان الجودة"]);

  // Contact
  const [contactEmail, setContactEmail] = useState("hello@studio.com");
  const [contactPhone, setContactPhone] = useState("+964 770 123 4567");
  const [contactInstagram, setContactInstagram] = useState("@studio_iq");
  const [contactWebsite, setContactWebsite] = useState("www.studio.com");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const favInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = () => toast({ title: "تم الحفظ ✓", description: "تم حفظ جميع التغييرات بنجاح" });
  const handlePreview = () => {
    const w = 1200, h = 800;
    const left = (screen.width - w) / 2, top = (screen.height - h) / 2;
    window.open("/storefront", "storefront", `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`);
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "brand", label: "الهوية", icon: Type },
    { id: "colors", label: "الألوان", icon: Palette },
    { id: "fonts", label: "الخطوط", icon: Type },
    { id: "sections", label: "الأقسام", icon: Layout },
    { id: "content", label: "المحتوى", icon: Edit3 },
    { id: "contact", label: "التواصل", icon: Phone },
  ];

  const getIconComponent = (iconName: string) => {
    return ICON_OPTIONS.find(o => o.value === iconName)?.Icon || Sparkles;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="تخصيص القالب" subtitle="تحكم كامل بمتجرك" />

      <main className="container mx-auto max-w-2xl px-4 space-y-5">
        {/* Scrollable Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}>
                <Icon className="h-3 w-3" />{tab.label}
              </button>
            );
          })}
        </div>

        {/* ═══════════ BRAND ═══════════ */}
        {activeTab === "brand" && (
          <div className="space-y-4">
            <Card title="اسم المتجر والوصف" icon={Type}>
              <div className="space-y-3">
                <Field label="اسم المتجر" value={storeName} onChange={setStoreName} placeholder="اسم متجرك" />
                <Field label="الشعار النصي" value={tagline} onChange={setTagline} placeholder="عبارة مميزة" />
                <div className="space-y-1.5">
                  <Label className="text-xs">وصف مختصر</Label>
                  <Textarea value={storeDescription} onChange={e => setStoreDescription(e.target.value)} rows={2} />
                </div>
              </div>
            </Card>

            <Card title="أزرار الصفحة الرئيسية" icon={Zap}>
              <div className="space-y-3">
                <Field label="الزر الرئيسي" value={heroButtonText} onChange={setHeroButtonText} />
                <Field label="الزر الثانوي" value={heroSecondaryButton} onChange={setHeroSecondaryButton} />
              </div>
            </Card>

            <Card title="الشعار والأيقونة" icon={Image}>
              <div className="flex gap-4">
                <ImageUploader label="شعار المتجر" hint="PNG / SVG" image={logoImage} inputRef={logoInputRef}
                  onUpload={handleImageUpload(setLogoImage)} onRemove={() => setLogoImage(null)} />
                <ImageUploader label="أيقونة (Favicon)" hint="32×32 px" image={favIcon} inputRef={favInputRef}
                  onUpload={handleImageUpload(setFavIcon)} onRemove={() => setFavIcon(null)} />
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════ COLORS ═══════════ */}
        {activeTab === "colors" && (
          <div className="space-y-4">
            <Card title="ألوان جاهزة" icon={Palette}>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.map((preset, i) => (
                  <button key={i} onClick={() => { setSelectedPreset(i); setUseCustomColors(false); setCustomPrimary(preset.primary); setCustomAccent(preset.accent); setCustomBg(preset.bg); setCustomText(preset.text); }}
                    className={`rounded-xl p-2.5 border-2 transition-all text-center ${!useCustomColors && selectedPreset === i ? "border-foreground shadow-md" : "border-border hover:border-foreground/30"}`}>
                    <div className="flex gap-1 justify-center mb-1.5">
                      <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: preset.primary }} />
                      <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <p className="text-[9px] font-semibold text-foreground">{preset.name}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card title="ألوان مخصصة" icon={Palette}>
              <button onClick={() => setUseCustomColors(true)}
                className={`w-full text-right text-xs font-medium mb-3 px-3 py-2 rounded-lg border transition-all ${useCustomColors ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}>
                {useCustomColors ? "✓ تم تفعيل الألوان المخصصة" : "اضغط لاستخدام ألوان مخصصة"}
              </button>
              {useCustomColors && (
                <div className="grid grid-cols-2 gap-3">
                  <ColorPicker label="اللون الرئيسي" value={customPrimary} onChange={setCustomPrimary} />
                  <ColorPicker label="اللون الثانوي" value={customAccent} onChange={setCustomAccent} />
                  <ColorPicker label="لون الخلفية" value={customBg} onChange={setCustomBg} />
                  <ColorPicker label="لون النص" value={customText} onChange={setCustomText} />
                </div>
              )}

              {/* Preview bar */}
              <div className="mt-4 rounded-xl overflow-hidden border border-border">
                <div className="p-4 flex items-center gap-3" style={{ backgroundColor: useCustomColors ? customBg : COLOR_PRESETS[selectedPreset].bg }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: useCustomColors ? customPrimary : COLOR_PRESETS[selectedPreset].primary }}>
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: useCustomColors ? customText : COLOR_PRESETS[selectedPreset].text }}>معاينة الألوان</p>
                    <p className="text-[10px] opacity-60" style={{ color: useCustomColors ? customText : COLOR_PRESETS[selectedPreset].text }}>هذا شكل الألوان في متجرك</p>
                  </div>
                  <div className="mr-auto px-3 py-1.5 rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: useCustomColors ? customAccent : COLOR_PRESETS[selectedPreset].accent }}>
                    زر
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════ FONTS ═══════════ */}
        {activeTab === "fonts" && (
          <div className="space-y-4">
            <Card title="خط العناوين" icon={Type}>
              <div className="space-y-2">
                {FONT_OPTIONS.map(font => (
                  <button key={font.value} onClick={() => setHeadingFont(font.value)}
                    className={`w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between ${
                      headingFont === font.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}>
                    <div>
                      <p className="text-xs font-bold text-foreground">{font.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5" style={{ fontFamily: font.value }}>{font.sample}</p>
                    </div>
                    {headingFont === font.value && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"><span className="text-primary-foreground text-[10px]">✓</span></div>}
                  </button>
                ))}
              </div>
            </Card>

            <Card title="خط النصوص" icon={Type}>
              <div className="space-y-2">
                {FONT_OPTIONS.map(font => (
                  <button key={font.value} onClick={() => setBodyFont(font.value)}
                    className={`w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between ${
                      bodyFont === font.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}>
                    <div>
                      <p className="text-xs font-bold text-foreground">{font.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5" style={{ fontFamily: font.value }}>{font.sample}</p>
                    </div>
                    {bodyFont === font.value && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"><span className="text-primary-foreground text-[10px]">✓</span></div>}
                  </button>
                ))}
              </div>
            </Card>

            <Card title="حجم الخط الأساسي" icon={Type}>
              <div className="flex items-center gap-4">
                <input type="range" min="12" max="20" value={baseFontSize} onChange={e => setBaseFontSize(e.target.value)}
                  className="flex-1 accent-[hsl(var(--primary))]" />
                <span className="text-sm font-bold text-foreground w-10 text-center">{baseFontSize}px</span>
              </div>
              <p className="text-muted-foreground mt-2" style={{ fontSize: `${baseFontSize}px` }}>هذا مثال على حجم النص</p>
            </Card>
          </div>
        )}

        {/* ═══════════ SECTIONS ═══════════ */}
        {activeTab === "sections" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">رتّب وفعّل/عطّل أقسام متجرك. اسحب لإعادة الترتيب.</p>
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={section.id}
                  className={`bg-card border rounded-xl overflow-hidden transition-all ${
                    section.enabled ? "border-primary/20" : "border-border opacity-50"
                  }`}>
                  <div className="p-3.5 flex items-center gap-3">
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveSection(section.id, -1)} disabled={idx === 0}
                        className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20 transition-colors">
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button onClick={() => moveSection(section.id, 1)} disabled={idx === sections.length - 1}
                        className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20 transition-colors">
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>

                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${section.enabled ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`h-4 w-4 ${section.enabled ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium ${section.enabled ? "text-foreground" : "text-muted-foreground"}`}>{section.label}</span>
                      <p className="text-[10px] text-muted-foreground truncate">{section.subtitle}</p>
                    </div>

                    {section.editable && section.enabled && (
                      <button onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                        className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                        <Edit3 className="h-3 w-3 text-muted-foreground" />
                      </button>
                    )}

                    <button onClick={() => toggleSection(section.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${section.enabled ? "bg-primary" : "bg-border"}`}>
                      <div className={`w-5 h-5 rounded-full bg-background shadow-sm absolute top-0.5 transition-all ${section.enabled ? "right-0.5" : "left-0.5"}`} />
                    </button>
                  </div>

                  {/* Inline content editing hint */}
                  {editingSection === section.id && section.enabled && (
                    <div className="border-t border-border px-4 py-3 bg-muted/30">
                      <p className="text-[11px] text-primary font-medium mb-1">✏️ تعديل محتوى هذا القسم</p>
                      <p className="text-[10px] text-muted-foreground">انتقل لتبويب "المحتوى" لتعديل عناصر قسم {section.label}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════ CONTENT ═══════════ */}
        {activeTab === "content" && (
          <div className="space-y-4">
            {/* Services */}
            {sections.find(s => s.id === "services")?.enabled && (
              <Card title="الخدمات" icon={Sparkles} action={<button onClick={addService} className="text-[10px] text-primary font-semibold flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة</button>}>
                <div className="space-y-3">
                  {services.map((service, i) => {
                    const SIcon = getIconComponent(service.icon);
                    return (
                      <div key={i} className="bg-muted/50 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <SIcon className="h-4 w-4 text-primary" />
                          </div>
                          <Input value={service.title} onChange={e => updateService(i, "title", e.target.value)} className="flex-1 h-8 text-xs" />
                          <button onClick={() => removeService(i)} className="text-destructive/60 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                        <Input value={service.desc} onChange={e => updateService(i, "desc", e.target.value)} className="h-8 text-xs" placeholder="وصف الخدمة" />
                        <div className="flex gap-1.5 flex-wrap">
                          {ICON_OPTIONS.slice(0, 8).map(opt => (
                            <button key={opt.value} onClick={() => updateService(i, "icon", opt.value)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${service.icon === opt.value ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:border-primary/30"}`}>
                              <opt.Icon className="h-3 w-3" />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Works */}
            {sections.find(s => s.id === "works")?.enabled && (
              <Card title="معرض الأعمال" icon={Image} action={<button onClick={addWork} className="text-[10px] text-primary font-semibold flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة</button>}>
                <div className="space-y-2">
                  {works.map((work, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl p-2.5">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <PenTool className="h-4 w-4 text-primary/30" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Input value={work.title} onChange={e => updateWork(i, "title", e.target.value)} className="h-7 text-xs" />
                        <Input value={work.category} onChange={e => updateWork(i, "category", e.target.value)} className="h-7 text-[10px]" placeholder="التصنيف" />
                      </div>
                      <button onClick={() => removeWork(i)} className="text-destructive/60 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Testimonials */}
            {sections.find(s => s.id === "testimonials")?.enabled && (
              <Card title="آراء العملاء" icon={Quote} action={<button onClick={addTestimonial} className="text-[10px] text-primary font-semibold flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة</button>}>
                <div className="space-y-3">
                  {testimonials.map((t, i) => (
                    <div key={i} className="bg-muted/50 rounded-xl p-3 space-y-2">
                      <div className="flex gap-2">
                        <Input value={t.name} onChange={e => updateTestimonial(i, "name", e.target.value)} className="flex-1 h-8 text-xs" placeholder="الاسم" />
                        <Input value={t.role} onChange={e => updateTestimonial(i, "role", e.target.value)} className="flex-1 h-8 text-xs" placeholder="الوظيفة" />
                        <button onClick={() => removeTestimonial(i)} className="text-destructive/60 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <Textarea value={t.text} onChange={e => updateTestimonial(i, "text", e.target.value)} className="text-xs min-h-[60px]" />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => updateTestimonial(i, "rating", s)}>
                            <Star className={`h-4 w-4 ${s <= t.rating ? "text-primary fill-current" : "text-border"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* CTA */}
            {sections.find(s => s.id === "cta")?.enabled && (
              <Card title="دعوة للإجراء (CTA)" icon={Zap}>
                <div className="space-y-3">
                  <Field label="العنوان" value={ctaTitle} onChange={setCtaTitle} />
                  <Field label="الوصف" value={ctaDesc} onChange={setCtaDesc} />
                  <Field label="نص الزر" value={ctaButton} onChange={setCtaButton} />
                </div>
              </Card>
            )}

            {/* About */}
            {sections.find(s => s.id === "about")?.enabled && (
              <Card title="من نحن" icon={Globe}>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">نص التعريف</Label>
                    <Textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows={3} className="text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">المميزات (3 عناصر)</Label>
                    {aboutFeatures.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Award className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <Input value={f} onChange={e => { const n = [...aboutFeatures]; n[i] = e.target.value; setAboutFeatures(n); }} className="h-8 text-xs" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ═══════════ CONTACT ═══════════ */}
        {activeTab === "contact" && (
          <Card title="معلومات التواصل" icon={Phone}>
            <div className="space-y-3">
              <FieldWithIcon icon={Mail} label="البريد الإلكتروني" value={contactEmail} onChange={setContactEmail} dir="ltr" />
              <FieldWithIcon icon={Phone} label="رقم الهاتف" value={contactPhone} onChange={setContactPhone} dir="ltr" />
              <FieldWithIcon icon={MessageCircle} label="واتساب" value={whatsappNumber} onChange={setWhatsappNumber} placeholder="رقم الواتساب (اختياري)" dir="ltr" />
              <FieldWithIcon icon={Instagram} label="انستقرام" value={contactInstagram} onChange={setContactInstagram} dir="ltr" />
              <FieldWithIcon icon={Globe} label="الموقع الإلكتروني" value={contactWebsite} onChange={setContactWebsite} dir="ltr" />
            </div>
          </Card>
        )}

        {/* ═══════════ ACTION BUTTONS ═══════════ */}
        <div className="flex gap-3 pt-2 sticky bottom-20 z-10">
          <Button onClick={handleSave} className="flex-1 h-12 gap-2 text-sm shadow-lg">
            <Save className="h-4 w-4" /> حفظ التغييرات
          </Button>
          <Button onClick={handlePreview} variant="outline" className="h-12 gap-2 text-sm px-6 bg-card shadow-lg">
            <Eye className="h-4 w-4" /> معاينة
          </Button>
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════

const Card = ({ title, icon: Icon, children, action }: { title: string; icon: React.ElementType; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />{title}
      </h3>
      {action}
    </div>
    {children}
  </div>
);

const Field = ({ label, value, onChange, placeholder, dir }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; dir?: string }) => (
  <div className="space-y-1.5">
    <Label className="text-xs">{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir} />
  </div>
);

const FieldWithIcon = ({ icon: Icon, label, value, onChange, placeholder, dir }: { icon: React.ElementType; label: string; value: string; onChange: (v: string) => void; placeholder?: string; dir?: string }) => (
  <div className="space-y-1.5">
    <Label className="text-xs flex items-center gap-1.5"><Icon className="h-3 w-3 text-muted-foreground" /> {label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir} />
  </div>
);

const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <Label className="text-[10px]">{label}</Label>
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer" />
      <Input value={value} onChange={e => onChange(e.target.value)} className="h-8 text-[10px] font-mono flex-1" dir="ltr" />
    </div>
  </div>
);

const ImageUploader = ({ label, hint, image, inputRef, onUpload, onRemove }: {
  label: string; hint: string; image: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) => (
  <div className="flex-1">
    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
    {image ? (
      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border group">
        <img src={image} alt={label} className="w-full h-full object-cover" />
        <button onClick={onRemove} className="absolute inset-0 bg-destructive/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <X className="h-4 w-4 text-destructive-foreground" />
        </button>
      </div>
    ) : (
      <button onClick={() => inputRef.current?.click()}
        className="w-16 h-16 rounded-xl bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center hover:bg-primary/10 transition-colors">
        <Upload className="h-4 w-4 text-primary" />
      </button>
    )}
    <p className="text-[10px] font-medium text-foreground mt-1.5">{label}</p>
    <p className="text-[8px] text-muted-foreground">{hint}</p>
  </div>
);

export default TemplateEditor;
