import { Check, Eye, Palette, ShoppingBag, FileText, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { TEMPLATES } from "@/data/templates";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useTemplateConfig } from "@/hooks/useTemplateConfig";

const TYPE_ICONS: Record<string, React.ElementType> = {
  store: ShoppingBag,
  digital: FileText,
  service: PenTool,
};

const TYPE_LABELS: Record<string, string> = {
  store: "منتجات مادية",
  digital: "منتجات رقمية",
  service: "خدمات",
};

const Templates = () => {
  const navigate = useNavigate();
  const { businessType } = useOnboarding();
  const { resetForBusinessType } = useTemplateConfig();

  // Active template is based on business type
  const activeTemplate = TEMPLATES.find(t =>
    (businessType === "physical" && t.type === "store") ||
    (businessType === "digital" && t.type === "digital") ||
    (businessType === "service" && t.type === "service")
  ) || TEMPLATES[0];

  const applyTemplate = (type: "store" | "digital" | "service") => {
    const bType = type === "store" ? "physical" : type;
    resetForBusinessType(bType as any);
    toast({ title: "تم تطبيق القالب", description: "تم تغيير قالب المتجر بنجاح" });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="القوالب" subtitle="اختر قالب لمتجرك" />

      <main className="container mx-auto px-4 space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">
            القالب الحالي مُحدد تلقائياً بناءً على نوع نشاطك: <span className="font-bold text-primary">{TYPE_LABELS[activeTemplate.type]}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {TEMPLATES.map((template) => {
            const isActive = template.id === activeTemplate.id;
            const Icon = TYPE_ICONS[template.type];
            return (
              <div key={template.id}
                className={`bg-card border rounded-xl overflow-hidden transition-all ${isActive ? "border-primary shadow-md" : "border-border"}`}>
                <div className="h-24 relative flex">
                  {template.colors.map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 text-[9px] font-medium bg-background/80 text-foreground px-2 py-0.5 rounded-full backdrop-blur-sm">
                    <Icon className="h-3 w-3" /> {TYPE_LABELS[template.type]}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-foreground">{template.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1">{template.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {template.features.map((feature) => (
                      <span key={feature} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{feature}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button onClick={() => applyTemplate(template.type)} size="sm"
                      variant={isActive ? "default" : "outline"} className="flex-1 gap-1 text-xs">
                      {isActive ? <><Check className="h-3 w-3" /> مُفعّل</> : <><Palette className="h-3 w-3" /> تطبيق</>}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-xs"
                      onClick={() => {
                        // Apply template first, then open in new tab
                        applyTemplate(template.type);
                        window.open("/storefront", "_blank");
                      }}>
                      <Eye className="h-3 w-3" /> معاينة
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Templates;
