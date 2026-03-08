import { useState } from "react";
import { Check, Eye, Palette, Sparkles, Crown, FileText, Wrench, ShoppingBag, ArrowRight, Package, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ProGate } from "@/components/ProGate";
import { usePlan } from "@/hooks/usePlan";
import PageHeader from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";

interface Template {
  id: string;
  name: string;
  description: string;
  category: "مجاني" | "مميز";
  type: "store" | "digital" | "service";
  colors: string[];
  features: string[];
  popular?: boolean;
  setupSteps?: string[];
}

const TEMPLATES: Template[] = [
  // Store templates
  { id: "minimal", name: "بسيط", description: "تصميم نظيف وبسيط يركز على المنتجات مع تنقل سهل", category: "مجاني", type: "store", colors: ["#FFFFFF", "#000000", "#0EA5E9"], features: ["تصميم متجاوب", "عرض شبكي", "فلتر المنتجات"] },
  { id: "elegant", name: "أنيق", description: "تصميم فاخر مناسب للماركات والمنتجات الراقية", category: "مجاني", type: "store", colors: ["#1A1A2E", "#E2B857", "#FFFFFF"], features: ["تصميم داكن", "أنيميشن سلس", "عرض المنتج بالكامل"], popular: true },
  { id: "vibrant", name: "حيوي", description: "تصميم ملون وعصري مناسب للملابس والأزياء", category: "مجاني", type: "store", colors: ["#FF6B6B", "#4ECDC4", "#FFFFFF"], features: ["ألوان زاهية", "صور كبيرة", "كاروسيل"] },
  { id: "professional", name: "احترافي", description: "تصميم متقدم مع ميزات إضافية للمتاجر الكبيرة", category: "مميز", type: "store", colors: ["#2D3436", "#00B894", "#FFFFFF"], features: ["مقارنة المنتجات", "تقييمات", "مدونة مدمجة", "SEO متقدم"], popular: true },
  { id: "luxury", name: "فخم", description: "تصميم فخم مع تأثيرات بصرية مذهلة", category: "مميز", type: "store", colors: ["#0C0C0C", "#D4AF37", "#FAF0E6"], features: ["تأثيرات 3D", "فيديو خلفية", "عرض VIP", "تخصيص كامل"] },
  { id: "fresh", name: "منعش", description: "تصميم خفيف ومنعش مناسب لمنتجات العناية والجمال", category: "مميز", type: "store", colors: ["#F8F9FA", "#A8E6CF", "#FFB7B2"], features: ["تدرجات لونية", "أيقونات مخصصة", "قسم المراجعات", "عروض خاصة"] },
  // Digital product templates
  {
    id: "digital-basic", name: "منتجات رقمية", description: "قالب مخصص لبيع الكتب الإلكترونية والدورات والملفات الرقمية",
    category: "مجاني", type: "digital", colors: ["#6C5CE7", "#A29BFE", "#FFFFFF"],
    features: ["تحميل فوري", "روابط آمنة", "معاينة المنتج", "دفع إلكتروني"],
    setupSteps: ["أضف منتجك الرقمي (كتاب، دورة، ملف)", "حدد السعر وطريقة التسليم", "فعّل الدفع الإلكتروني", "شارك رابط متجرك"],
  },
  {
    id: "digital-pro", name: "أكاديمية رقمية", description: "منصة متكاملة لبيع الدورات التعليمية مع نظام اشتراكات",
    category: "مميز", type: "digital", colors: ["#2D3436", "#6C5CE7", "#FDCB6E"],
    features: ["نظام اشتراكات", "مستويات وصول", "شهادات إتمام", "بث مباشر"], popular: true,
    setupSteps: ["أنشئ الدورة وأضف المحتوى", "حدد مستويات الاشتراك", "فعّل نظام الشهادات", "ابدأ البيع"],
  },
  // Service templates
  {
    id: "service-basic", name: "خدمات", description: "قالب لعرض وبيع الخدمات المتنوعة مثل التصميم والبرمجة والاستشارات",
    category: "مجاني", type: "service", colors: ["#00B894", "#00CEC9", "#FFFFFF"],
    features: ["حجز مواعيد", "عرض الباقات", "نماذج أعمال", "تواصل مباشر"],
    setupSteps: ["أضف خدماتك مع الوصف والسعر", "حدد أوقات التوفر", "أضف نماذج أعمالك السابقة", "فعّل نظام الحجز"],
  },
  {
    id: "service-pro", name: "وكالة احترافية", description: "قالب متقدم للوكالات ومقدمي الخدمات المتخصصة",
    category: "مميز", type: "service", colors: ["#0C0C0C", "#00B894", "#E17055"],
    features: ["إدارة مشاريع", "عقود رقمية", "فواتير تلقائية", "تقارير للعملاء"], popular: true,
    setupSteps: ["أنشئ ملف الوكالة", "أضف الخدمات والباقات", "فعّل نظام العقود والفواتير", "ابدأ استقبال العملاء"],
  },
];

const TYPE_TABS = [
  { id: "all", label: "الكل", icon: Globe },
  { id: "store", label: "متجر", icon: ShoppingBag },
  { id: "digital", label: "منتجات رقمية", icon: FileText },
  { id: "service", label: "خدمات", icon: Wrench },
];

const Templates = () => {
  const { isPro } = usePlan();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("الكل");
  const [activeType, setActiveType] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("minimal");
  const [setupDialogTemplate, setSetupDialogTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filtered = TEMPLATES.filter((t) => {
    const matchCategory = activeCategory === "الكل" || t.category === activeCategory;
    const matchType = activeType === "all" || t.type === activeType;
    return matchCategory && matchType;
  });

  const applyTemplate = (template: Template) => {
    setSelectedTemplate(template.id);
    if (template.setupSteps) {
      setSetupDialogTemplate(template);
    } else {
      toast({ title: "تم تطبيق القالب", description: "تم تغيير قالب المتجر بنجاح" });
    }
  };

  const startSetup = () => {
    if (setupDialogTemplate) {
      toast({ title: "تم تطبيق القالب ✓", description: `قالب "${setupDialogTemplate.name}" جاهز - ابدأ بإضافة المحتوى` });
      setSetupDialogTemplate(null);
      navigate("/add");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "digital": return <FileText className="h-3 w-3" />;
      case "service": return <Wrench className="h-3 w-3" />;
      default: return <ShoppingBag className="h-3 w-3" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "digital": return "رقمي";
      case "service": return "خدمة";
      default: return "متجر";
    }
  };

  const renderTemplateCard = (template: Template) => (
    <div
      key={template.id}
      className={`bg-card border rounded-xl overflow-hidden transition-all ${selectedTemplate === template.id ? "border-primary shadow-sm" : "border-border"}`}
    >
      <div className="h-28 relative flex">
        {template.colors.map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
        {template.popular && (
          <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
            <Sparkles className="h-3 w-3" /> شائع
          </span>
        )}
        {template.category === "مميز" && (
          <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold bg-foreground/80 text-background px-2 py-0.5 rounded-full">
            <Crown className="h-3 w-3" /> مميز
          </span>
        )}
        {/* Type badge */}
        <span className="absolute bottom-2 right-2 flex items-center gap-1 text-[9px] font-medium bg-background/80 text-foreground px-2 py-0.5 rounded-full backdrop-blur-sm">
          {getTypeIcon(template.type)} {getTypeLabel(template.type)}
        </span>
        {selectedTemplate === template.id && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">{template.name}</h3>
          <div className="flex items-center gap-1">
            {template.colors.map((color, i) => (
              <span key={i} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">{template.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {template.features.map((feature) => (
            <span key={feature} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{feature}</span>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Button onClick={() => applyTemplate(template)} size="sm" variant={selectedTemplate === template.id ? "default" : "outline"} className="flex-1 gap-1 text-xs">
            {selectedTemplate === template.id ? <><Check className="h-3 w-3" /> مُطبق</> : <><Palette className="h-3 w-3" /> تطبيق</>}
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setPreviewTemplate(template)}><Eye className="h-3 w-3" /> معاينة</Button>
        </div>
      </div>
    </div>
  );

  const freeTemplates = filtered.filter((t) => t.category === "مجاني");
  const premiumTemplates = filtered.filter((t) => t.category === "مميز");

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="القوالب" subtitle="اختر قالب لمتجرك" />

      <main className="container mx-auto px-4 space-y-4">
        {/* Type filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TYPE_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveType(tab.id)} className={`flex items-center gap-1.5 flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeType === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                <Icon className="h-3.5 w-3.5" />{tab.label}
              </button>
            );
          })}
        </div>

        {/* Category filter */}
        <div className="flex gap-2">
          {["الكل", "مجاني", "مميز"].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeTemplates.map(renderTemplateCard)}

          {premiumTemplates.length > 0 && (
            <ProGate feature="القوالب المميزة والاحترافية">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {premiumTemplates.map(renderTemplateCard)}
              </div>
            </ProGate>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground col-span-full">
              <Package className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">لا توجد قوالب في هذا التصنيف</p>
            </div>
          )}
        </div>

        {/* Setup dialog for digital/service templates */}
        {setupDialogTemplate && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 space-y-5 animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground">إعداد قالب "{setupDialogTemplate.name}"</h3>
                <p className="text-xs text-muted-foreground mt-1">اتبع هذه الخطوات لإكمال إعداد القالب</p>
              </div>

              <div className="space-y-3">
                {setupDialogTemplate.setupSteps?.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-foreground">{step}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={startSetup} className="flex-1 gap-1.5">
                  <ArrowRight className="h-4 w-4" /> ابدأ الإعداد
                </Button>
                <Button variant="outline" onClick={() => setSetupDialogTemplate(null)}>لاحقاً</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Templates;
