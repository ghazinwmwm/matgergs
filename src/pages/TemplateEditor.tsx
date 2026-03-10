import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette, Type, Image, Eye, Save, Sparkles,
  Globe, Instagram, Phone, Mail, MessageCircle,
  Plus, X, Trash2, Upload, Star, Quote,
  Zap, PenTool, ChevronDown, RotateCcw, Link2, Check,
  ExternalLink
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
  type ServiceItem,
  type WorkItem,
  type TestimonialItem,
} from "@/hooks/useTemplateConfig";

// ═══════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════

const FONT_OPTIONS = [
  { value: "IBM Plex Sans Arabic", label: "IBM Plex" },
  { value: "Cairo", label: "القاهرة" },
  { value: "Tajawal", label: "تجوّل" },
  { value: "Almarai", label: "المرعي" },
  { value: "Noto Sans Arabic", label: "نوتو" },
  { value: "Rubik", label: "روبيك" },
];

type TabId = "brand" | "design" | "contact";

const TemplateEditor = () => {
  const navigate = useNavigate();
  const { config, updateConfig, resetConfig, getActiveColors } = useTemplateConfig();
  const [activeTab, setActiveTab] = useState<TabId>("brand");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const activeColors = getActiveColors();

  // Image upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "حجم الملف كبير", description: "الحد الأقصى 2MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => updateConfig({ logoImage: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Section toggle
  const toggleSection = (id: string) => {
    updateConfig({ sections: config.sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s) });
  };

  // Content CRUD
  const addService = () => updateConfig({ services: [...config.services, { icon: "Sparkles", title: "خدمة جديدة", desc: "وصف الخدمة" }] });
  const removeService = (i: number) => updateConfig({ services: config.services.filter((_, idx) => idx !== i) });
  const updateService = (i: number, field: keyof ServiceItem, value: string) => {
    updateConfig({ services: config.services.map((s, idx) => idx === i ? { ...s, [field]: value } : s) });
  };

  const addWork = () => updateConfig({ works: [...config.works, { title: "مشروع جديد", category: "تصنيف", link: "" }] });
  const removeWork = (i: number) => updateConfig({ works: config.works.filter((_, idx) => idx !== i) });
  const updateWork = (i: number, field: keyof WorkItem, value: string) => {
    updateConfig({ works: config.works.map((w, idx) => idx === i ? { ...w, [field]: value } : w) });
  };

  const addTestimonial = () => updateConfig({ testimonials: [...config.testimonials, { name: "عميل جديد", role: "الوظيفة", text: "رأي العميل...", rating: 5 }] });
  const removeTestimonial = (i: number) => updateConfig({ testimonials: config.testimonials.filter((_, idx) => idx !== i) });
  const updateTestimonial = (i: number, field: keyof TestimonialItem, value: string | number) => {
    updateConfig({ testimonials: config.testimonials.map((t, idx) => idx === i ? { ...t, [field]: value } : t) });
  };

  const handlePreview = () => {
    window.open("/storefront", "storefront", `width=1200,height=800,scrollbars=yes,resizable=yes`);
  };

  const handleReset = () => {
    if (window.confirm("هل تريد إعادة تعيين جميع الإعدادات؟")) {
      resetConfig();
      toast({ title: "تم إعادة التعيين" });
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "brand", label: "الهوية والمحتوى", icon: Type },
    { id: "design", label: "التصميم", icon: Palette },
    { id: "contact", label: "التواصل", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-background pb-36" dir="rtl">
      <PageHeader title="تخصيص المتجر" subtitle="عدّل هوية ومحتوى متجرك" />

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

        <div className="space-y-4 mt-2">

          {/* ═══ BRAND & CONTENT TAB ═══ */}
          {activeTab === "brand" && (
            <div className="space-y-4">

              {/* Logo + Store Name */}
              <Card>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <div className="flex items-center gap-4 mb-4">
                  {config.logoImage ? (
                    <div className="relative group">
                      <img src={config.logoImage} alt="" className="w-14 h-14 rounded-2xl object-cover border border-border" />
                      <div className="absolute inset-0 bg-foreground/50 rounded-2xl flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => logoInputRef.current?.click()} className="w-6 h-6 rounded-lg bg-background/90 flex items-center justify-center"><Upload className="h-3 w-3" /></button>
                        <button onClick={() => updateConfig({ logoImage: null })} className="w-6 h-6 rounded-lg bg-destructive/90 flex items-center justify-center text-destructive-foreground"><Trash2 className="h-3 w-3" /></button>
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
                    <Input value={config.storeName} onChange={e => updateConfig({ storeName: e.target.value })}
                      className="font-bold rounded-xl" placeholder="اسم المتجر" />
                    <Input value={config.tagline} onChange={e => updateConfig({ tagline: e.target.value })}
                      className="text-sm rounded-xl" placeholder="شعار نصي قصير" />
                  </div>
                </div>
                <Textarea value={config.storeDescription} onChange={e => updateConfig({ storeDescription: e.target.value })}
                  rows={2} className="text-sm resize-none rounded-xl" placeholder="وصف المتجر" />
              </Card>

              {/* Hero Buttons */}
              <Card>
                <p className="text-xs font-semibold text-muted-foreground mb-2">أزرار الصفحة الرئيسية</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={config.heroButtonText} onChange={e => updateConfig({ heroButtonText: e.target.value })}
                    className="text-sm rounded-xl" placeholder="الزر الرئيسي" />
                  <Input value={config.heroSecondaryButton} onChange={e => updateConfig({ heroSecondaryButton: e.target.value })}
                    className="text-sm rounded-xl" placeholder="الزر الثانوي" />
                </div>
              </Card>

              {/* Sections Toggle + Content Editing */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground px-1">أقسام المتجر</p>

                {/* Services */}
                <ContentBlock
                  title="الخدمات"
                  icon={<Sparkles className="h-4 w-4" />}
                  enabled={config.sections.find(s => s.id === "services")?.enabled ?? true}
                  onToggle={() => toggleSection("services")}
                  open={openSections["services"]}
                  onOpenToggle={() => toggleOpen("services")}
                  count={config.services.length}
                >
                  <div className="space-y-2">
                    {config.services.map((service, i) => (
                      <div key={i} className="flex items-start gap-2 bg-background rounded-xl p-2.5 border border-border/50">
                        <div className="flex-1 space-y-1.5">
                          <Input value={service.title} onChange={e => updateService(i, "title", e.target.value)}
                            className="h-8 text-xs rounded-lg font-medium" placeholder="اسم الخدمة" />
                          <Input value={service.desc} onChange={e => updateService(i, "desc", e.target.value)}
                            className="h-8 text-xs rounded-lg" placeholder="وصف مختصر" />
                        </div>
                        <button onClick={() => removeService(i)} className="mt-1 text-muted-foreground hover:text-destructive p-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <AddButton onClick={addService} />
                  </div>
                </ContentBlock>

                {/* Works */}
                <ContentBlock
                  title="معرض الأعمال"
                  icon={<Image className="h-4 w-4" />}
                  enabled={config.sections.find(s => s.id === "works")?.enabled ?? true}
                  onToggle={() => toggleSection("works")}
                  open={openSections["works"]}
                  onOpenToggle={() => toggleOpen("works")}
                  count={config.works.length}
                >
                  <div className="space-y-2">
                    {config.works.map((work, i) => (
                      <div key={i} className="bg-background rounded-xl p-2.5 border border-border/50 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 space-y-1.5">
                            <Input value={work.title} onChange={e => updateWork(i, "title", e.target.value)}
                              className="h-8 text-xs rounded-lg font-medium" placeholder="اسم المشروع" />
                            <div className="flex gap-1.5">
                              <Input value={work.category} onChange={e => updateWork(i, "category", e.target.value)}
                                className="h-7 text-[10px] rounded-lg flex-1" placeholder="التصنيف" />
                              <Input value={work.link || ""} onChange={e => updateWork(i, "link", e.target.value)}
                                className="h-7 text-[10px] rounded-lg flex-1" placeholder="رابط (اختياري)" dir="ltr" />
                            </div>
                          </div>
                          <button onClick={() => removeWork(i)} className="text-muted-foreground hover:text-destructive p-1">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <AddButton onClick={addWork} />
                  </div>
                </ContentBlock>

                {/* Testimonials */}
                <ContentBlock
                  title="آراء العملاء"
                  icon={<Quote className="h-4 w-4" />}
                  enabled={config.sections.find(s => s.id === "testimonials")?.enabled ?? true}
                  onToggle={() => toggleSection("testimonials")}
                  open={openSections["testimonials"]}
                  onOpenToggle={() => toggleOpen("testimonials")}
                  count={config.testimonials.length}
                >
                  <div className="space-y-2">
                    {config.testimonials.map((t, i) => (
                      <div key={i} className="bg-background rounded-xl p-2.5 border border-border/50 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5 flex-1">
                            <Input value={t.name} onChange={e => updateTestimonial(i, "name", e.target.value)}
                              className="h-8 text-xs rounded-lg flex-1" placeholder="الاسم" />
                            <Input value={t.role} onChange={e => updateTestimonial(i, "role", e.target.value)}
                              className="h-8 text-xs rounded-lg flex-1" placeholder="المنصب" />
                          </div>
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
                </ContentBlock>

                {/* CTA */}
                <ContentBlock
                  title="دعوة للإجراء"
                  icon={<Zap className="h-4 w-4" />}
                  enabled={config.sections.find(s => s.id === "cta")?.enabled ?? true}
                  onToggle={() => toggleSection("cta")}
                  open={openSections["cta"]}
                  onOpenToggle={() => toggleOpen("cta")}
                >
                  <div className="space-y-2">
                    <Input value={config.ctaTitle} onChange={e => updateConfig({ ctaTitle: e.target.value })}
                      className="text-sm rounded-xl" placeholder="العنوان" />
                    <Input value={config.ctaDesc} onChange={e => updateConfig({ ctaDesc: e.target.value })}
                      className="text-sm rounded-xl" placeholder="الوصف" />
                    <Input value={config.ctaButton} onChange={e => updateConfig({ ctaButton: e.target.value })}
                      className="text-sm rounded-xl" placeholder="نص الزر" />
                  </div>
                </ContentBlock>

                {/* About */}
                <ContentBlock
                  title="من نحن"
                  icon={<Globe className="h-4 w-4" />}
                  enabled={config.sections.find(s => s.id === "about")?.enabled ?? true}
                  onToggle={() => toggleSection("about")}
                  open={openSections["about"]}
                  onOpenToggle={() => toggleOpen("about")}
                >
                  <Textarea value={config.aboutText} onChange={e => updateConfig({ aboutText: e.target.value })}
                    rows={3} className="text-xs rounded-xl resize-none" placeholder="نبذة تعريفية" />
                </ContentBlock>

                {/* Store */}
                <ContentBlock
                  title="المتجر (المنتجات)"
                  icon={<PenTool className="h-4 w-4" />}
                  enabled={config.sections.find(s => s.id === "store")?.enabled ?? true}
                  onToggle={() => toggleSection("store")}
                  open={false}
                  onOpenToggle={() => {}}
                  noContent
                />
              </div>
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
                      <button key={i} onClick={() => updateConfig({ selectedPreset: i, useCustomColors: false, colors: { ...preset } })}
                        className={`relative rounded-xl p-2 border-2 transition-all ${
                          isSelected ? "border-primary shadow-md" : "border-border hover:border-muted-foreground/30"
                        }`}>
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

                {/* Custom Toggle */}
                <div className="flex items-center justify-between py-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">ألوان مخصصة</span>
                  <Switch checked={config.useCustomColors} onCheckedChange={v => updateConfig({ useCustomColors: v })} />
                </div>

                {config.useCustomColors && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {([
                      ["الرئيسي", "primary"],
                      ["الثانوي", "accent"],
                      ["الخلفية", "bg"],
                      ["النصوص", "text"],
                    ] as const).map(([label, key]) => (
                      <div key={key} className="flex items-center gap-2 bg-muted/20 rounded-xl p-2">
                        <input type="color" value={config.colors[key]} onChange={e => updateConfig({ colors: { ...config.colors, [key]: e.target.value } })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent" />
                        <div className="flex-1">
                          <p className="text-[10px] text-muted-foreground">{label}</p>
                          <p className="text-[9px] font-mono text-foreground" dir="ltr">{config.colors[key]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Fonts */}
              <Card>
                <p className="text-xs font-semibold text-foreground mb-3">الخطوط</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1.5">خط العناوين</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {FONT_OPTIONS.map(font => (
                        <button key={font.value} onClick={() => updateConfig({ headingFont: font.value })}
                          className={`p-2 rounded-xl border-2 transition-all text-center ${
                            config.headingFont === font.value ? "border-primary bg-primary/5" : "border-border"
                          }`}>
                          <p className="text-xs font-bold" style={{ fontFamily: font.value }}>{font.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1.5">خط النصوص</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {FONT_OPTIONS.map(font => (
                        <button key={font.value} onClick={() => updateConfig({ bodyFont: font.value })}
                          className={`p-2 rounded-xl border-2 transition-all text-center ${
                            config.bodyFont === font.value ? "border-primary bg-primary/5" : "border-border"
                          }`}>
                          <p className="text-xs" style={{ fontFamily: font.value }}>{font.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Preview */}
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="p-4" style={{ backgroundColor: activeColors.bg }}>
                  <p className="text-sm font-bold mb-1" style={{ color: activeColors.text, fontFamily: config.headingFont }}>
                    {config.storeName}
                  </p>
                  <p className="text-xs mb-3" style={{ color: `${activeColors.text}88`, fontFamily: config.bodyFont }}>
                    {config.tagline}
                  </p>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: activeColors.primary }}>
                      {config.heroButtonText}
                    </div>
                    <div className="px-4 py-2 rounded-xl text-[11px] border" style={{ borderColor: `${activeColors.text}20`, color: activeColors.text }}>
                      {config.heroSecondaryButton}
                    </div>
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
                      <Input value={config[key]} onChange={e => updateConfig({ [key]: e.target.value })}
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
            <Button onClick={handlePreview} className="flex-1 h-11 gap-2 text-sm rounded-xl font-semibold">
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

const ContentBlock = ({
  title, icon, enabled, onToggle, open, onOpenToggle, count, children, noContent,
}: {
  title: string; icon: React.ReactNode; enabled: boolean;
  onToggle: () => void; open: boolean; onOpenToggle: () => void;
  count?: number; children?: React.ReactNode; noContent?: boolean;
}) => (
  <div className={`bg-card border rounded-2xl overflow-hidden transition-all ${enabled ? "border-border" : "border-border/40 opacity-60"}`}>
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={!noContent ? onOpenToggle : undefined}>
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        {count !== undefined && <p className="text-[10px] text-muted-foreground">{count} عنصر</p>}
      </div>
      {!noContent && enabled && (
        <button onClick={onOpenToggle} className="p-1 text-muted-foreground">
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
      <Switch checked={enabled} onCheckedChange={onToggle} className="flex-shrink-0" />
    </div>
    {open && enabled && children && (
      <div className="border-t border-border/50 p-3 bg-muted/10">{children}</div>
    )}
  </div>
);

export default TemplateEditor;

// Keep this export for Storefront
export const getIconComponent = (iconName: string): React.ElementType => {
  const MAP: Record<string, React.ElementType> = { Palette, Sparkles, PenTool, Zap, Star, Globe, Image, Quote };
  return MAP[iconName] || Sparkles;
};
