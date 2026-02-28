import { useState } from "react";
import { 
  Check, Crown, Zap, Star, Shield, Truck, Users, Palette, Activity, 
  Ticket, Store, Globe, Headphones, Sparkles, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const BASIC_FEATURES = [
  { text: "متجر واحد", icon: Store, included: true },
  { text: "50 منتج كحد أقصى", icon: Zap, included: true },
  { text: "أكواد خصم غير محدودة", icon: Ticket, included: true },
  { text: "شركة توصيل واحدة", icon: Truck, included: true },
  { text: "قالب مجاني واحد", icon: Palette, included: true },
  { text: "دعم عبر البريد", icon: Headphones, included: true },
  { text: "متاجر متعددة", icon: Store, included: false },
  { text: "فريق عمل (مديرين)", icon: Users, included: false },
  { text: "بيكسل وتتبع", icon: Activity, included: false },
  { text: "دومين مخصص", icon: Globe, included: false },
  { text: "قوالب مميزة", icon: Crown, included: false },
];

const PRO_FEATURES = [
  { text: "متاجر غير محدودة", icon: Store, included: true },
  { text: "منتجات غير محدودة", icon: Zap, included: true },
  { text: "أكواد خصم غير محدودة", icon: Ticket, included: true },
  { text: "جميع شركات التوصيل", icon: Truck, included: true },
  { text: "جميع القوالب المميزة", icon: Crown, included: true },
  { text: "دعم أولوية 24/7", icon: Headphones, included: true },
  { text: "حتى 5 مديرين", icon: Users, included: true },
  { text: "فيسبوك بيكسل + Google Analytics", icon: Activity, included: true },
  { text: "دومين مخصص", icon: Globe, included: true },
  { text: "تقارير متقدمة", icon: Star, included: true },
  { text: "حماية SSL مجانية", icon: Shield, included: true },
];

// Comparison data
const COMPARISON = [
  { feature: "عدد المتاجر", basic: "1", pro: "غير محدود" },
  { feature: "عدد المنتجات", basic: "50", pro: "غير محدود" },
  { feature: "أكواد الخصم", basic: "غير محدود", pro: "غير محدود" },
  { feature: "شركات التوصيل", basic: "1", pro: "الكل" },
  { feature: "أعضاء الفريق", basic: "—", pro: "5" },
  { feature: "القوالب", basic: "مجاني واحد", pro: "الكل" },
  { feature: "بيكسل وتتبع", basic: "—", pro: "✓" },
  { feature: "دومين مخصص", basic: "—", pro: "✓" },
  { feature: "تقارير متقدمة", basic: "—", pro: "✓" },
  { feature: "الدعم", basic: "بريد", pro: "24/7" },
];

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showComparison, setShowComparison] = useState(false);

  const basicPrice = billingPeriod === "yearly" ? 12000 : 15000;
  const proPrice = billingPeriod === "yearly" ? 28000 : 35000;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === "pro" && selectedPlan !== "pro") {
      toast({ title: "ترقية الباقة", description: "سيتم توجيهك لإتمام الدفع" });
    }
  };

  const currentFeatures = selectedPlan === "basic" ? BASIC_FEATURES : PRO_FEATURES;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-10 pb-4">
        <h1 className="text-xl font-bold text-foreground">الباقات والأسعار</h1>
        <p className="text-sm text-muted-foreground mt-0.5">اختر الباقة المناسبة لمتجرك</p>
      </div>

      <main className="container mx-auto px-4 space-y-5">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-1 bg-secondary rounded-xl p-1">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              billingPeriod === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            شهري
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
              billingPeriod === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            سنوي
            <span className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-bold">وفّر 20%</span>
          </button>
        </div>

        {/* Plan Cards */}
        <div className="space-y-3">
          {/* Basic */}
          <div
            onClick={() => handleSelectPlan("basic")}
            className={`bg-card border-2 rounded-2xl p-5 transition-all cursor-pointer ${
              selectedPlan === "basic" ? "border-primary shadow-sm" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === "basic" ? "border-primary" : "border-muted-foreground/30"
                }`}>
                  {selectedPlan === "basic" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <h3 className="text-base font-bold text-foreground">الأساسية</h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">مثالية للمتاجر الصغيرة والمبتدئين</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{basicPrice.toLocaleString("ar-IQ")}</span>
              <span className="text-xs text-muted-foreground">د.ع / شهر</span>
            </div>
            {billingPeriod === "yearly" && (
              <p className="text-[10px] text-success mt-1">توفير {((15000 * 12 * 0.2)).toLocaleString("ar-IQ")} د.ع سنوياً</p>
            )}
          </div>

          {/* Pro */}
          <div
            onClick={() => handleSelectPlan("pro")}
            className={`bg-card border-2 rounded-2xl overflow-hidden transition-all cursor-pointer ${
              selectedPlan === "pro" ? "border-primary shadow-sm" : "border-border"
            }`}
          >
            <div className="bg-primary text-primary-foreground text-[10px] font-bold text-center py-1.5">
              ⭐ الأكثر شعبية
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === "pro" ? "border-primary" : "border-muted-foreground/30"
                  }`}>
                    {selectedPlan === "pro" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <h3 className="text-base font-bold text-foreground">الاحترافية</h3>
                  <Crown className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">للمتاجر المتنامية التي تحتاج ميزات متقدمة</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{proPrice.toLocaleString("ar-IQ")}</span>
                <span className="text-xs text-muted-foreground">د.ع / شهر</span>
              </div>
              {billingPeriod === "yearly" && (
                <p className="text-[10px] text-success mt-1">توفير {((35000 * 12 * 0.2)).toLocaleString("ar-IQ")} د.ع سنوياً</p>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => handleSelectPlan(selectedPlan)}
          className="w-full h-12 rounded-xl font-bold"
          size="lg"
        >
          {selectedPlan === "basic" ? "✓ الباقة الحالية" : "ترقية الآن"}
        </Button>

        {/* Features of Selected Plan */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              ميزات الباقة {selectedPlan === "basic" ? "الأساسية" : "الاحترافية"}
            </h3>
          </div>
          <div className="space-y-3">
            {currentFeatures.map((feature) => (
              <div
                key={feature.text}
                className={`flex items-center gap-2.5 ${!feature.included ? "opacity-35" : ""}`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  feature.included ? "bg-success/10" : "bg-muted"
                }`}>
                  {feature.included ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <span className="text-sm text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Toggle */}
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full text-center text-xs font-bold text-primary py-2"
        >
          {showComparison ? "إخفاء المقارنة" : "📊 مقارنة الباقات جنباً لجنب"}
        </button>

        {showComparison && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 text-center bg-secondary/50 py-2.5 border-b border-border">
              <span className="text-[11px] font-semibold text-muted-foreground">الميزة</span>
              <span className="text-[11px] font-bold text-foreground">الأساسية</span>
              <span className="text-[11px] font-bold text-primary">الاحترافية</span>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 text-center py-2.5 px-2 ${i < COMPARISON.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-[11px] text-foreground text-right pr-2">{row.feature}</span>
                <span className="text-[11px] text-muted-foreground">{row.basic}</span>
                <span className="text-[11px] text-primary font-medium">{row.pro}</span>
              </div>
            ))}
          </div>
        )}

        {/* FAQ */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">أسئلة شائعة</h3>
          {[
            { q: "هل يمكنني التغيير بين الباقات؟", a: "نعم، يمكنك الترقية أو التخفيض في أي وقت. سيتم احتساب الفرق تلقائياً." },
            { q: "هل هناك فترة تجريبية؟", a: "نعم، نقدم 14 يوم تجربة مجانية للباقة الاحترافية." },
            { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل الدفع عبر زين كاش، آسيا حوالة، وبطاقات الائتمان." },
          ].map((faq) => (
            <div key={faq.q} className="border-t border-border pt-3 first:border-0 first:pt-0">
              <p className="text-xs font-medium text-foreground">{faq.q}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Plans;
