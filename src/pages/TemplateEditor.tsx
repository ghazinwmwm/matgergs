import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette, Type, Eye, Save, Sparkles,
  Globe, Instagram, Phone, Mail, MessageCircle,
  Plus, Trash2, Upload, Star, Quote,
  Zap, PenTool, ChevronDown, RotateCcw, Check,
  Image, X, Megaphone, GripVertical, Package,
  Shirt, Watch, Smartphone, Footprints, Camera, Monitor, Code,
  Layout, MousePointerClick, Link2, ArrowUpDown,
  Layers, Settings2, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import {
  useTemplateConfig,
  COLOR_PRESETS,
  COLOR_PRESET_NAMES,
  type ServiceItem,
  type WorkItem,
  type TestimonialItem,
  type CustomFont,
  type CategorySectionItem,
  type ButtonAction,
} from "@/hooks/useTemplateConfig";
import { useInventory } from "@/hooks/useInventory";

// ═══════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════

const BUILTIN_FONTS = [
  { value: "IBM Plex Sans Arabic", label: "IBM Plex" },
  { value: "Cairo", label: "القاهرة" },
  { value: "Tajawal", label: "تجوّل" },
  { value: "Almarai", label: "المرعي" },
  { value: "Noto Sans Arabic", label: "نوتو" },
  { value: "Rubik", label: "روبيك" },
];

const CATEGORY_ICON_OPTIONS = [
  "Package", "Shirt", "Sparkles", "Watch", "Smartphone", "Footprints",
  "Star", "Palette", "Camera", "Monitor", "Code", "PenTool",
];

const BUTTON_ACTION_TYPES = [
  { type: "scroll" as const, label: "انتقال لقسم", icon: ArrowUpDown },
  { type: "url" as const, label: "فتح رابط", icon: ExternalLink },
  { type: "whatsapp" as const, label: "واتساب", icon: MessageCircle },
  { type: "phone" as const, label: "اتصال", icon: Phone },
  { type: "email" as const, label: "بريد", icon: Mail },
  { type: "none" as const, label: "بدون وظيفة", icon: X },
];

const SCROLL_TARGETS = [
  { value: "hero-section", label: "صفحة الهبوط" },
  { value: "services-section", label: "الخدمات" },
  { value: "works-section", label: "معرض الأعمال" },
  { value: "store-section", label: "المتجر" },
  { value: "testimonials-section", label: "آراء العملاء" },
  { value: "about-section", label: "من نحن" },
];

const SERVICE_ICONS = [
  "Palette", "Code", "Monitor", "Sparkles", "PenTool", "Camera",
  "Star", "Zap", "Globe", "Layers", "Package", "Smartphone",
];

type TabId = "sections" | "storefront" | "design" | "contact";

const TemplateEditor = () => {
  const navigate = useNavigate();
  const { config, updateConfig, resetConfig, getActiveColors } = useTemplateConfig();
  const { categories } = useInventory();
  const [activeTab, setActiveTab] = useState<TabId>("sections");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const categoryImageInputRef = useRef<HTMLInputElement>(null);
  const categoryImageTarget = useRef<string>("");

  const activeColors = getActiveColors();
  const allFonts = [
    ...BUILTIN_FONTS,
    ...config.customFonts.map(f => ({ value: f.name, label: `✦ ${f.name}` })),
  ];

  const update = (partial: Parameters<typeof updateConfig>[0]) => {
    updateConfig(partial);
    setHasChanges(true);
  };

  // ═══ UPLOADS ═══
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "الحد الأقصى 2MB", variant: "destructive" }); return; }
    const reader = new FileReader();
    reader.onloadend = () => update({ logoImage: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: "الحد الأقصى 5MB", variant: "destructive" }); return; }
    const reader = new FileReader();
    reader.onloadend = () => { update({ bannerImages: [...config.bannerImages, reader.result as string] }); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "الحد الأقصى 2MB", variant: "destructive" }); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const cat = categoryImageTarget.current;
      update({ categoryIcons: config.categoryIcons.map(ci => ci.category === cat ? { ...ci, image: reader.result as string } : ci) });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const fontUploadTarget = useRef<"heading" | "body">("heading");
  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (![".ttf", ".otf", ".woff", ".woff2"].includes(ext)) { toast({ title: "استخدم TTF, OTF, WOFF, WOFF2", variant: "destructive" }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ title: "الحد الأقصى 5MB", variant: "destructive" }); return; }
    const fontName = file.name.replace(/\.[^.]+$/, "");
    const reader = new FileReader();
    reader.onloadend = () => {
      const newFont: CustomFont = { name: fontName, url: reader.result as string };
      const alreadyExists = config.customFonts.some(f => f.name === fontName);
      const updatedFonts = alreadyExists ? config.customFonts : [...config.customFonts, newFont];
      const target = fontUploadTarget.current;
      update({ customFonts: updatedFonts, ...(target === "heading" ? { headingFont: fontName } : { bodyFont: fontName }) });
      toast({ title: `تم تعيين "${fontName}" كخط ${target === "heading" ? "العناوين" : "النصوص"}` });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const triggerFontUpload = (target: "heading" | "body") => { fontUploadTarget.current = target; fontInputRef.current?.click(); };
  const removeCustomFont = (name: string) => {
    update({
      customFonts: config.customFonts.filter(f => f.name !== name),
      headingFont: config.headingFont === name ? "IBM Plex Sans Arabic" : config.headingFont,
      bodyFont: config.bodyFont === name ? "IBM Plex Sans Arabic" : config.bodyFont,
    });
    const el = document.getElementById(`custom-font-${name}`);
    if (el) el.remove();
  };

  // ═══ SECTION MANAGEMENT ═══
  const toggleSection = (id: string) => update({ sections: config.sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s) });
  const moveSection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= config.sections.length) return;
    const arr = [...config.sections];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    update({ sections: arr });
  };

  // ═══ CONTENT CRUD ═══
  const addService = () => update({ services: [...config.services, { icon: "Sparkles", title: "خدمة جديدة", desc: "وصف الخدمة" }] });
  const removeService = (i: number) => update({ services: config.services.filter((_, idx) => idx !== i) });
  const updateService = (i: number, field: keyof ServiceItem, value: string) => update({ services: config.services.map((s, idx) => idx === i ? { ...s, [field]: value } : s) });

  const addWork = () => update({ works: [...config.works, { title: "مشروع جديد", category: "تصنيف", link: "" }] });
  const removeWork = (i: number) => update({ works: config.works.filter((_, idx) => idx !== i) });
  const updateWork = (i: number, field: keyof WorkItem, value: string) => update({ works: config.works.map((w, idx) => idx === i ? { ...w, [field]: value } : w) });

  const addTestimonial = () => update({ testimonials: [...config.testimonials, { name: "عميل جديد", role: "الوظيفة", text: "رأي العميل...", rating: 5 }] });
  const removeTestimonial = (i: number) => update({ testimonials: config.testimonials.filter((_, idx) => idx !== i) });
  const updateTestimonial = (i: number, field: keyof TestimonialItem, value: string | number) => update({ testimonials: config.testimonials.map((t, idx) => idx === i ? { ...t, [field]: value } : t) });

  const addAboutFeature = () => update({ aboutFeatures: [...config.aboutFeatures, "ميزة جديدة"] });
  const removeAboutFeature = (i: number) => update({ aboutFeatures: config.aboutFeatures.filter((_, idx) => idx !== i) });
  const updateAboutFeature = (i: number, value: string) => update({ aboutFeatures: config.aboutFeatures.map((f, idx) => idx === i ? value : f) });

  // Category sections
  const addCategorySection = () => {
    const usedCats = config.categorySections.map(cs => cs.category);
    const availableCat = categories.find(c => !usedCats.includes(c)) || "قسم جديد";
    update({ categorySections: [...config.categorySections, { id: `cs-${Date.now()}`, category: availableCat, enabled: true }] });
  };
  const removeCategorySection = (id: string) => update({ categorySections: config.categorySections.filter(cs => cs.id !== id) });
  const toggleCategorySection = (id: string) => update({ categorySections: config.categorySections.map(cs => cs.id === id ? { ...cs, enabled: !cs.enabled } : cs) });
  const updateCategorySection = (id: string, category: string) => update({ categorySections: config.categorySections.map(cs => cs.id === id ? { ...cs, category } : cs) });
  const moveCategorySection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= config.categorySections.length) return;
    const arr = [...config.categorySections];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    update({ categorySections: arr });
  };

  const handlePreview = () => window.open("/storefront", "_blank");
  const handleSave = () => { setHasChanges(false); toast({ title: "✓ تم الحفظ" }); };
  const handleReset = () => {
    if (window.confirm("هل تريد إعادة تعيين جميع الإعدادات؟")) {
      resetConfig(); setHasChanges(false); toast({ title: "تم إعادة التعيين" });
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "sections", label: "الأقسام", icon: Layers },
    { id: "storefront", label: "المتجر", icon: Package },
    { id: "design", label: "التصميم", icon: Palette },
    { id: "contact", label: "التواصل", icon: Phone },
  ];

  // ═══ SECTION CONFIG RENDERERS ═══
  const renderSectionEditor = (sectionId: string) => {
    switch (sectionId) {
      case "hero":
        return (
          <div className="space-y-4">
            {/* Brand Identity */}
            <div className="space-y-3">
              <SectionLabel label="هوية المتجر" />
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <div className="flex items-center gap-3">
                {config.logoImage ? (
                  <div className="relative group">
                    <img src={config.logoImage} alt="" className="w-14 h-14 rounded-2xl object-cover border border-border" />
                    <div className="absolute inset-0 bg-foreground/50 rounded-2xl flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => logoInputRef.current?.click()} className="w-6 h-6 rounded-lg bg-background/90 flex items-center justify-center"><Upload className="h-3 w-3" /></button>
                      <button onClick={() => update({ logoImage: null })} className="w-6 h-6 rounded-lg bg-destructive/90 flex items-center justify-center text-destructive-foreground"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => logoInputRef.current?.click()}
                    className="w-14 h-14 rounded-2xl bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center gap-0.5 hover:border-primary/40 transition-all">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[8px] text-muted-foreground">شعار</span>
                  </button>
                )}
                <div className="flex-1 space-y-2">
                  <Input value={config.storeName} onChange={e => update({ storeName: e.target.value })} className="font-bold rounded-xl" placeholder="اسم المتجر" />
                  <Input value={config.tagline} onChange={e => update({ tagline: e.target.value })} className="text-sm rounded-xl" placeholder="شعار نصي" />
                </div>
              </div>
              <Textarea value={config.storeDescription} onChange={e => update({ storeDescription: e.target.value })}
                rows={2} className="text-sm resize-none rounded-xl" placeholder="وصف المتجر" />
            </div>

            {/* Hero Buttons with Actions */}
            <div className="space-y-3">
              <SectionLabel label="الأزرار ووظائفها" icon={<MousePointerClick className="h-3.5 w-3.5" />} />
              <ButtonActionEditor
                label="الزر الرئيسي"
                text={config.heroButtonText}
                action={config.heroButtonAction}
                onTextChange={v => update({ heroButtonText: v })}
                onActionChange={a => update({ heroButtonAction: a })}
                config={config}
              />
              <ButtonActionEditor
                label="الزر الثانوي"
                text={config.heroSecondaryButton}
                action={config.heroSecondaryAction}
                onTextChange={v => update({ heroSecondaryButton: v })}
                onActionChange={a => update({ heroSecondaryAction: a })}
                config={config}
              />
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-2">
            {config.services.map((service, i) => (
              <div key={i} className="bg-background rounded-xl p-3 border border-border/50">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {/* Icon selector */}
                      <div className="flex gap-1 overflow-x-auto flex-shrink-0">
                        {SERVICE_ICONS.slice(0, 4).map(icon => {
                          const IconComp = getIconComponent(icon);
                          return (
                            <button key={icon} onClick={() => updateService(i, "icon", icon)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                                service.icon === icon ? "bg-primary/15 ring-1 ring-primary" : "bg-muted/50 hover:bg-muted"
                              }`}>
                              <IconComp className="h-3.5 w-3.5" />
                            </button>
                          );
                        })}
                      </div>
                      <Input value={service.title} onChange={e => updateService(i, "title", e.target.value)}
                        className="h-8 text-xs rounded-lg font-medium flex-1" placeholder="اسم الخدمة" />
                    </div>
                    <Input value={service.desc} onChange={e => updateService(i, "desc", e.target.value)}
                      className="h-8 text-xs rounded-lg" placeholder="وصف مختصر" />
                  </div>
                  <button onClick={() => removeService(i)} className="mt-1 text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            <AddButton onClick={addService} />
          </div>
        );

      case "works":
        return (
          <div className="space-y-2">
            {config.works.map((work, i) => (
              <div key={i} className="bg-background rounded-xl p-3 border border-border/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Input value={work.title} onChange={e => updateWork(i, "title", e.target.value)}
                    className="h-8 text-xs rounded-lg font-medium flex-1" placeholder="اسم المشروع" />
                  <button onClick={() => removeWork(i)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input value={work.category} onChange={e => updateWork(i, "category", e.target.value)}
                    className="h-7 text-[10px] rounded-lg flex-1" placeholder="التصنيف" />
                  <Input value={work.link || ""} onChange={e => updateWork(i, "link", e.target.value)}
                    className="h-7 text-[10px] rounded-lg flex-1" placeholder="رابط (اختياري)" dir="ltr" />
                </div>
              </div>
            ))}
            <AddButton onClick={addWork} />
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-2">
            {config.testimonials.map((t, i) => (
              <div key={i} className="bg-background rounded-xl p-3 border border-border/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Input value={t.name} onChange={e => updateTestimonial(i, "name", e.target.value)}
                    className="h-8 text-xs rounded-lg flex-1" placeholder="الاسم" />
                  <Input value={t.role} onChange={e => updateTestimonial(i, "role", e.target.value)}
                    className="h-8 text-xs rounded-lg flex-1" placeholder="المنصب" />
                  <button onClick={() => removeTestimonial(i)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Textarea value={t.text} onChange={e => updateTestimonial(i, "text", e.target.value)}
                  className="text-xs min-h-[40px] rounded-lg resize-none" placeholder="نص الرأي" />
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => updateTestimonial(i, "rating", s)} className="p-0.5">
                      <Star className={`h-3.5 w-3.5 ${s <= t.rating ? "text-amber-400 fill-amber-400" : "text-border"}`} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <AddButton onClick={addTestimonial} />
          </div>
        );

      case "cta":
        return (
          <div className="space-y-3">
            <Input value={config.ctaTitle} onChange={e => update({ ctaTitle: e.target.value })}
              className="text-sm rounded-xl" placeholder="العنوان" />
            <Input value={config.ctaDesc} onChange={e => update({ ctaDesc: e.target.value })}
              className="text-sm rounded-xl" placeholder="الوصف" />
            <SectionLabel label="زر الدعوة ووظيفته" icon={<MousePointerClick className="h-3.5 w-3.5" />} />
            <ButtonActionEditor
              label="الزر"
              text={config.ctaButton}
              action={config.ctaButtonAction}
              onTextChange={v => update({ ctaButton: v })}
              onActionChange={a => update({ ctaButtonAction: a })}
              config={config}
            />
          </div>
        );

      case "about":
        return (
          <div className="space-y-3">
            <Textarea value={config.aboutText} onChange={e => update({ aboutText: e.target.value })}
              rows={3} className="text-xs rounded-xl resize-none" placeholder="نبذة تعريفية" />
            <SectionLabel label="المميزات" />
            <div className="space-y-1.5">
              {config.aboutFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={f} onChange={e => updateAboutFeature(i, e.target.value)}
                    className="h-8 text-xs rounded-lg flex-1" placeholder="ميزة" />
                  <button onClick={() => removeAboutFeature(i)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <AddButton onClick={addAboutFeature} />
            </div>
          </div>
        );

      case "store":
        return null; // Store content managed in storefront tab

      default:
        return null;
    }
  };

  const SECTION_META: Record<string, { icon: React.ElementType; description: string }> = {
    hero: { icon: Layout, description: "العنوان والوصف والأزرار والشعار" },
    services: { icon: Sparkles, description: "عرض خدماتك ومهاراتك" },
    works: { icon: Image, description: "نماذج من أعمالك ومشاريعك" },
    store: { icon: Package, description: "عرض وبيع المنتجات" },
    testimonials: { icon: Quote, description: "تقييمات وآراء العملاء" },
    cta: { icon: Zap, description: "قسم تحفيزي مع زر إجراء" },
    about: { icon: Globe, description: "تعريف بالمتجر والمميزات" },
  };

  return (
    <div className="min-h-screen bg-background pb-36" dir="rtl">
      <PageHeader title="تخصيص المتجر" subtitle="تحكم كامل بكل تفاصيل متجرك" />

      {/* Hidden inputs */}
      <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
      <input ref={categoryImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleCategoryImageUpload} />
      <input ref={fontInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={handleFontUpload} />

      <main className="container mx-auto max-w-lg px-4">

        {/* TAB BAR */}
        <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl pb-3 pt-1 -mx-4 px-4">
          <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 mt-2">

          {/* ═══ SECTIONS TAB ═══ */}
          {activeTab === "sections" && (
            <div className="space-y-2">
              <p className="text-[11px] text-muted-foreground px-1 flex items-center gap-1.5">
                <Settings2 className="h-3 w-3" />
                فعّل الأقسام وعدّل محتواها • اسحب للترتيب
              </p>

              {config.sections.map((section, index) => {
                const meta = SECTION_META[section.id];
                if (!meta) return null;
                const Icon = meta.icon;
                const isExpanded = expandedSection === section.id;
                const hasEditor = section.id !== "store";

                return (
                  <div key={section.id}
                    className={`bg-card border rounded-2xl overflow-hidden transition-all ${
                      section.enabled ? "border-border" : "border-border/40 opacity-60"
                    }`}>
                    {/* Section Header */}
                    <div className="flex items-center gap-2 px-3 py-3">
                      {/* Reorder arrows */}
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveSection(index, -1)} disabled={index === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5">
                          <ChevronDown className="h-3 w-3 rotate-180" />
                        </button>
                        <button onClick={() => moveSection(index, 1)} disabled={index === config.sections.length - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5">
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0 cursor-pointer" onClick={hasEditor && section.enabled ? () => setExpandedSection(isExpanded ? null : section.id) : undefined}>
                        <p className="text-[13px] font-semibold text-foreground">{section.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{meta.description}</p>
                      </div>

                      {hasEditor && section.enabled && (
                        <button onClick={() => setExpandedSection(isExpanded ? null : section.id)} className="p-1 text-muted-foreground">
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      )}

                      <Switch checked={section.enabled} onCheckedChange={() => toggleSection(section.id)} className="flex-shrink-0" />
                    </div>

                    {/* Section Content */}
                    {isExpanded && section.enabled && hasEditor && (
                      <div className="border-t border-border/50 p-3 bg-muted/10">
                        {renderSectionEditor(section.id)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══ STOREFRONT TAB ═══ */}
          {activeTab === "storefront" && (
            <div className="space-y-4">
              {/* Announcement Bar */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground">شريط الإعلان</p>
                  </div>
                  <Switch checked={config.announcementBar.enabled}
                    onCheckedChange={v => update({ announcementBar: { ...config.announcementBar, enabled: v } })} />
                </div>
                {config.announcementBar.enabled && (
                  <div className="space-y-2">
                    <Input value={config.announcementBar.text}
                      onChange={e => update({ announcementBar: { ...config.announcementBar, text: e.target.value } })}
                      className="text-sm rounded-xl" placeholder="نص الإعلان..." />
                    <div className="flex gap-2">
                      <ColorPicker label="الخلفية" value={config.announcementBar.bgColor}
                        onChange={v => update({ announcementBar: { ...config.announcementBar, bgColor: v } })} />
                      <ColorPicker label="النص" value={config.announcementBar.textColor}
                        onChange={v => update({ announcementBar: { ...config.announcementBar, textColor: v } })} />
                    </div>
                    <div className="rounded-xl overflow-hidden">
                      <div className="text-center py-2 px-3 text-xs font-semibold"
                        style={{ backgroundColor: config.announcementBar.bgColor, color: config.announcementBar.textColor }}>
                        {config.announcementBar.text}
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Banner Images */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground">صور البنر</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{config.bannerImages.length} صورة</span>
                </div>
                <div className="space-y-2">
                  {config.bannerImages.map((img, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden border border-border">
                      <img src={img} alt="" className="w-full h-24 object-cover" />
                      <button onClick={() => update({ bannerImages: config.bannerImages.filter((_, idx) => idx !== i) })}
                        className="absolute top-2 left-2 w-6 h-6 rounded-full bg-destructive/90 flex items-center justify-center">
                        <X className="h-3 w-3 text-destructive-foreground" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => bannerInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-1.5 py-4 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all text-xs font-medium">
                    <Upload className="h-4 w-4" /> إضافة صورة بنر
                  </button>
                </div>
              </Card>

              {/* Category Display */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-foreground">عرض الأقسام</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button onClick={() => update({ categoryDisplayMode: "icons" })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${config.categoryDisplayMode === "icons" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <Package className="h-5 w-5 mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-foreground">أيقونات</p>
                  </button>
                  <button onClick={() => update({ categoryDisplayMode: "pills" })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${config.categoryDisplayMode === "pills" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex gap-1 justify-center mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-[8px]">قسم</span>
                      <span className="px-2 py-0.5 rounded-full bg-muted text-[8px]">قسم</span>
                    </div>
                    <p className="text-[10px] font-bold text-foreground">أزرار</p>
                  </button>
                </div>

                {config.categoryDisplayMode === "icons" && (
                  <div className="space-y-2 border-t border-border/50 pt-3">
                    <p className="text-[10px] font-semibold text-muted-foreground">أيقونات الأقسام</p>
                    {config.categoryIcons.map((ci) => (
                      <div key={ci.category} className="flex items-center gap-2 bg-muted/20 rounded-xl p-2">
                        <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center overflow-hidden bg-card cursor-pointer"
                          onClick={() => { categoryImageTarget.current = ci.category; categoryImageInputRef.current?.click(); }}>
                          {ci.image ? <img src={ci.image} alt="" className="w-full h-full object-cover" /> :
                            (() => { const CI = getCategoryIcon(ci.icon); return <CI className="h-5 w-5 text-muted-foreground" />; })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-foreground truncate">{ci.category}</p>
                          <div className="flex gap-1 mt-1 overflow-x-auto">
                            {CATEGORY_ICON_OPTIONS.slice(0, 6).map(icon => {
                              const IconComp = getCategoryIcon(icon);
                              return (
                                <button key={icon} onClick={() => update({
                                  categoryIcons: config.categoryIcons.map(c => c.category === ci.category ? { ...c, icon, image: null } : c)
                                })} className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${ci.icon === icon && !ci.image ? "bg-primary/15 ring-1 ring-primary" : "hover:bg-muted"}`}>
                                  <IconComp className="h-3 w-3" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {ci.image && (
                          <button onClick={() => update({ categoryIcons: config.categoryIcons.map(c => c.category === ci.category ? { ...c, image: null } : c) })}
                            className="text-muted-foreground hover:text-destructive p-1"><X className="h-3 w-3" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Category Sections */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground">صفوف المنتجات</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mb-3">صفوف أفقية للمنتجات حسب القسم</p>
                <div className="space-y-2">
                  {config.categorySections.map((cs, i) => (
                    <div key={cs.id} className="flex items-center gap-2 bg-muted/20 rounded-xl p-2.5">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveCategorySection(i, -1)} disabled={i === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5">
                          <ChevronDown className="h-3 w-3 rotate-180" />
                        </button>
                        <button onClick={() => moveCategorySection(i, 1)} disabled={i === config.categorySections.length - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5">
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>
                      <select value={cs.category} onChange={e => updateCategorySection(cs.id, e.target.value)}
                        className="flex-1 h-8 text-xs rounded-lg border border-border bg-card px-2 text-foreground">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <Switch checked={cs.enabled} onCheckedChange={() => toggleCategorySection(cs.id)} />
                      <button onClick={() => removeCategorySection(cs.id)} className="text-muted-foreground hover:text-destructive p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <AddButton onClick={addCategorySection} />
                </div>
              </Card>
            </div>
          )}

          {/* ═══ DESIGN TAB ═══ */}
          {activeTab === "design" && (
            <div className="space-y-4">
              {/* Color Presets */}
              <Card>
                <p className="text-xs font-semibold text-foreground mb-3">الألوان</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {COLOR_PRESETS.map((preset, i) => {
                    const isSelected = !config.useCustomColors && config.selectedPreset === i;
                    return (
                      <button key={i} onClick={() => update({ selectedPreset: i, useCustomColors: false, colors: { ...preset } })}
                        className={`relative rounded-xl p-2 border-2 transition-all ${isSelected ? "border-primary shadow-md" : "border-border hover:border-muted-foreground/30"}`}>
                        {isSelected && (
                          <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex gap-0.5 justify-center mb-1.5">
                          <div className="w-4 h-4 rounded-full ring-1 ring-border" style={{ backgroundColor: preset.primary }} />
                          <div className="w-4 h-4 rounded-full ring-1 ring-border" style={{ backgroundColor: preset.accent }} />
                        </div>
                        <p className="text-[9px] font-semibold text-foreground">{COLOR_PRESET_NAMES[i]}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between py-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">ألوان مخصصة</span>
                  <Switch checked={config.useCustomColors} onCheckedChange={v => update({ useCustomColors: v })} />
                </div>

                {config.useCustomColors && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {([["الرئيسي", "primary"], ["الثانوي", "accent"], ["الخلفية", "bg"], ["النصوص", "text"]] as const).map(([label, key]) => (
                      <ColorPicker key={key} label={label} value={config.colors[key]}
                        onChange={v => update({ colors: { ...config.colors, [key]: v } })} showHex />
                    ))}
                  </div>
                )}
              </Card>

              {/* Fonts */}
              <Card>
                <p className="text-xs font-semibold text-foreground mb-3">الخطوط</p>
                {config.customFonts.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {config.customFonts.map(font => (
                      <div key={font.name} className="flex items-center justify-between bg-primary/5 rounded-lg px-3 py-2">
                        <span className="text-[11px] font-medium text-foreground" style={{ fontFamily: font.name }}>✦ {font.name}</span>
                        <button onClick={() => removeCustomFont(font.name)} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-3">
                  <FontSelector label="خط العناوين" fonts={allFonts} selected={config.headingFont}
                    onChange={v => update({ headingFont: v })} onUpload={() => triggerFontUpload("heading")} />
                  <FontSelector label="خط النصوص" fonts={allFonts} selected={config.bodyFont}
                    onChange={v => update({ bodyFont: v })} onUpload={() => triggerFontUpload("body")} />
                </div>
              </Card>

              {/* Live Preview */}
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="p-4" style={{ backgroundColor: activeColors.bg }}>
                  <p className="text-sm font-bold mb-1" style={{ color: activeColors.text, fontFamily: config.headingFont }}>{config.storeName}</p>
                  <p className="text-xs mb-3" style={{ color: `${activeColors.text}88`, fontFamily: config.bodyFont }}>{config.tagline}</p>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: activeColors.primary }}>{config.heroButtonText}</div>
                    <div className="px-4 py-2 rounded-xl text-[11px] border" style={{ borderColor: `${activeColors.text}20`, color: activeColors.text }}>{config.heroSecondaryButton}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ CONTACT TAB ═══ */}
          {activeTab === "contact" && (
            <Card>
              <p className="text-xs font-semibold text-foreground mb-3">معلومات التواصل</p>
              <div className="space-y-2">
                {([
                  { icon: Mail, label: "البريد الإلكتروني", key: "contactEmail" as const, placeholder: "hello@example.com" },
                  { icon: Phone, label: "رقم الهاتف", key: "contactPhone" as const, placeholder: "+964 xxx xxx xxxx" },
                  { icon: MessageCircle, label: "واتساب", key: "whatsappNumber" as const, placeholder: "+964xxxxxxxxxx" },
                  { icon: Instagram, label: "انستقرام", key: "contactInstagram" as const, placeholder: "@username" },
                  { icon: Globe, label: "الموقع", key: "contactWebsite" as const, placeholder: "www.example.com" },
                ]).map(({ icon: Icon, label, key, placeholder }) => (
                  <div key={key} className="flex items-center gap-3 bg-muted/20 rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
                      <Input value={config[key]} onChange={e => update({ [key]: e.target.value })}
                        placeholder={placeholder} dir="ltr"
                        className="h-7 text-xs border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* STICKY ACTION BAR */}
        <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-30">
          <div className="flex gap-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-2 shadow-2xl shadow-foreground/5">
            <Button onClick={handlePreview} variant="outline" className="flex-1 h-11 gap-2 text-sm rounded-xl font-semibold">
              <Eye className="h-4 w-4" /> معاينة
            </Button>
            <Button onClick={handleSave} className={`flex-1 h-11 gap-2 text-sm rounded-xl font-semibold ${hasChanges ? "" : "opacity-60"}`}>
              <Save className="h-4 w-4" /> حفظ
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
// SUB-COMPONENTS
// ═══════════════════════════════════════

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-2xl p-4">{children}</div>
);

const AddButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}
    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all text-xs font-medium">
    <Plus className="h-3.5 w-3.5" /> إضافة
  </button>
);

const SectionLabel = ({ label, icon }: { label: string; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-1.5">
    {icon}
    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{label}</p>
  </div>
);

const ColorPicker = ({ label, value, onChange, showHex }: { label: string; value: string; onChange: (v: string) => void; showHex?: boolean }) => (
  <div className="flex-1 flex items-center gap-2 bg-muted/20 rounded-xl p-2">
    <input type="color" value={value} onChange={e => onChange(e.target.value)}
      className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent" />
    <div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      {showHex && <p className="text-[9px] font-mono text-foreground" dir="ltr">{value}</p>}
    </div>
  </div>
);

const FontSelector = ({ label, fonts, selected, onChange, onUpload }: {
  label: string; fonts: { value: string; label: string }[];
  selected: string; onChange: (v: string) => void; onUpload: () => void;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <button onClick={onUpload} className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline">
        <Upload className="h-3 w-3" /> رفع خط
      </button>
    </div>
    <div className="grid grid-cols-3 gap-1.5">
      {fonts.map(font => (
        <button key={font.value} onClick={() => onChange(font.value)}
          className={`p-2 rounded-xl border-2 transition-all text-center ${selected === font.value ? "border-primary bg-primary/5" : "border-border"}`}>
          <p className="text-xs font-bold" style={{ fontFamily: font.value }}>{font.label}</p>
        </button>
      ))}
    </div>
  </div>
);

// Button Action Editor - the key new component
const ButtonActionEditor = ({ label, text, action, onTextChange, onActionChange, config }: {
  label: string;
  text: string;
  action: ButtonAction;
  onTextChange: (v: string) => void;
  onActionChange: (a: ButtonAction) => void;
  config: { contactPhone: string; whatsappNumber: string; contactEmail: string };
}) => {
  return (
    <div className="bg-background rounded-xl p-3 border border-border/50 space-y-2.5">
      <div className="flex items-center gap-2">
        <MousePointerClick className="h-3.5 w-3.5 text-primary flex-shrink-0" />
        <p className="text-[11px] font-semibold text-foreground">{label}</p>
      </div>

      <Input value={text} onChange={e => onTextChange(e.target.value)}
        className="h-8 text-xs rounded-lg" placeholder="نص الزر" />

      {/* Action type selector */}
      <div className="grid grid-cols-3 gap-1">
        {BUTTON_ACTION_TYPES.map(({ type, label: actionLabel, icon: ActionIcon }) => (
          <button key={type} onClick={() => {
            switch (type) {
              case "scroll": onActionChange({ type: "scroll", target: "store-section" }); break;
              case "url": onActionChange({ type: "url", url: "" }); break;
              case "whatsapp": onActionChange({ type: "whatsapp", message: "" }); break;
              case "phone": onActionChange({ type: "phone" }); break;
              case "email": onActionChange({ type: "email" }); break;
              case "none": onActionChange({ type: "none" }); break;
            }
          }}
            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-semibold transition-all ${
              action.type === type ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}>
            <ActionIcon className="h-3 w-3" />
            {actionLabel}
          </button>
        ))}
      </div>

      {/* Action-specific config */}
      {action.type === "scroll" && (
        <select value={action.target} onChange={e => onActionChange({ type: "scroll", target: e.target.value })}
          className="w-full h-8 text-xs rounded-lg border border-border bg-card px-2 text-foreground">
          {SCROLL_TARGETS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      )}
      {action.type === "url" && (
        <Input value={action.url} onChange={e => onActionChange({ type: "url", url: e.target.value })}
          className="h-8 text-xs rounded-lg" placeholder="https://example.com" dir="ltr" />
      )}
      {action.type === "whatsapp" && (
        <Input value={action.message || ""} onChange={e => onActionChange({ type: "whatsapp", message: e.target.value })}
          className="h-8 text-xs rounded-lg" placeholder="رسالة واتساب (اختياري)" />
      )}
    </div>
  );
};

export default TemplateEditor;

// Keep this export for Storefront
export const getIconComponent = (iconName: string): React.ElementType => {
  const MAP: Record<string, React.ElementType> = {
    Palette, Sparkles, PenTool, Zap, Star, Globe, Image, Quote,
    Code, Monitor, Camera, Package, Smartphone, Shirt, Watch, Footprints,
    Layers,
  };
  return MAP[iconName] || Sparkles;
};

const getCategoryIcon = (iconName: string): React.ElementType => {
  const MAP: Record<string, React.ElementType> = {
    Package, Shirt, Sparkles, Watch, Smartphone, Footprints,
    Star, Palette, Camera, Monitor, Code, PenTool,
  };
  return MAP[iconName] || Package;
};
