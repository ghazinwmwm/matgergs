import { useState } from "react";
import { Check, Eye, Palette, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ProGate } from "@/components/ProGate";
import { usePlan } from "@/hooks/usePlan";
import PageHeader from "@/components/PageHeader";

interface Template {
  id: string;
  name: string;
  description: string;
  category: "مجاني" | "مميز";
  colors: string[];
  features: string[];
  popular?: boolean;
}

const TEMPLATES: Template[] = [
  { id: "minimal", name: "بسيط", description: "تصميم نظيف وبسيط يركز على المنتجات مع تنقل سهل", category: "مجاني", colors: ["#FFFFFF", "#000000", "#0EA5E9"], features: ["تصميم متجاوب", "عرض شبكي", "فلتر المنتجات"] },
  { id: "elegant", name: "أنيق", description: "تصميم فاخر مناسب للماركات والمنتجات الراقية", category: "مجاني", colors: ["#1A1A2E", "#E2B857", "#FFFFFF"], features: ["تصميم داكن", "أنيميشن سلس", "عرض المنتج بالكامل"], popular: true },
  { id: "vibrant", name: "حيوي", description: "تصميم ملون وعصري مناسب للملابس والأزياء", category: "مجاني", colors: ["#FF6B6B", "#4ECDC4", "#FFFFFF"], features: ["ألوان زاهية", "صور كبيرة", "كاروسيل"] },
  { id: "professional", name: "احترافي", description: "تصميم متقدم مع ميزات إضافية للمتاجر الكبيرة", category: "مميز", colors: ["#2D3436", "#00B894", "#FFFFFF"], features: ["مقارنة المنتجات", "تقييمات", "مدونة مدمجة", "SEO متقدم"], popular: true },
  { id: "luxury", name: "فخم", description: "تصميم فخم مع تأثيرات بصرية مذهلة", category: "مميز", colors: ["#0C0C0C", "#D4AF37", "#FAF0E6"], features: ["تأثيرات 3D", "فيديو خلفية", "عرض VIP", "تخصيص كامل"] },
  { id: "fresh", name: "منعش", description: "تصميم خفيف ومنعش مناسب لمنتجات العناية والجمال", category: "مميز", colors: ["#F8F9FA", "#A8E6CF", "#FFB7B2"], features: ["تدرجات لونية", "أيقونات مخصصة", "قسم المراجعات", "عروض خاصة"] },
];

const Templates = () => {
  const { isPro } = usePlan(); // templates premium = pro only
  const [activeCategory, setActiveCategory] = useState<string>("الكل");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("minimal");

  const filtered = TEMPLATES.filter((t) => activeCategory === "الكل" || t.category === activeCategory);

  const applyTemplate = (id: string) => {
    setSelectedTemplate(id);
    toast({ title: "تم تطبيق القالب", description: "تم تغيير قالب المتجر بنجاح" });
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
          <Button onClick={() => applyTemplate(template.id)} size="sm" variant={selectedTemplate === template.id ? "default" : "outline"} className="flex-1 gap-1 text-xs">
            {selectedTemplate === template.id ? <><Check className="h-3 w-3" /> مُطبق</> : <><Palette className="h-3 w-3" /> تطبيق</>}
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-xs"><Eye className="h-3 w-3" /> معاينة</Button>
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
        <div className="flex gap-2">
          {["الكل", "مجاني", "مميز"].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Free templates - always accessible */}
          {freeTemplates.map(renderTemplateCard)}

          {/* Premium templates - PRO gated */}
          {premiumTemplates.length > 0 && (
            <ProGate feature="القوالب المميزة والاحترافية">
              <div className="space-y-4">
                {premiumTemplates.map(renderTemplateCard)}
              </div>
            </ProGate>
          )}
        </div>
      </main>
    </div>
  );
};

export default Templates;
