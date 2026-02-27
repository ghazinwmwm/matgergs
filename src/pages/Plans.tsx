import { useState } from "react";
import { Check, Crown, Zap, Star, Shield, Truck, Users, Palette, Activity, Ticket, Store, Globe, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  badge?: string;
  features: { text: string; included: boolean; icon: typeof Check }[];
  cta: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "الأساسية",
    price: 15000,
    period: "شهرياً",
    description: "مثالية للمتاجر الصغيرة والمبتدئين",
    features: [
      { text: "متجر واحد", included: true, icon: Store },
      { text: "50 منتج", included: true, icon: Zap },
      { text: "أكواد خصم غير محدودة", included: true, icon: Ticket },
      { text: "ربط شركة توصيل واحدة", included: true, icon: Truck },
      { text: "قالب واحد مجاني", included: true, icon: Palette },
      { text: "دعم عبر البريد", included: true, icon: Headphones },
      { text: "متاجر متعددة", included: false, icon: Store },
      { text: "فريق عمل (مديرين)", included: false, icon: Users },
      { text: "بيكسل وتتبع", included: false, icon: Activity },
      { text: "دومين مخصص", included: false, icon: Globe },
      { text: "قوالب مميزة", included: false, icon: Crown },
    ],
    cta: "الباقة الحالية",
  },
  {
    id: "pro",
    name: "الاحترافية",
    price: 35000,
    period: "شهرياً",
    description: "للمتاجر المتنامية التي تحتاج ميزات متقدمة",
    badge: "الأكثر شعبية",
    popular: true,
    features: [
      { text: "متاجر غير محدودة", included: true, icon: Store },
      { text: "منتجات غير محدودة", included: true, icon: Zap },
      { text: "أكواد خصم غير محدودة", included: true, icon: Ticket },
      { text: "جميع شركات التوصيل", included: true, icon: Truck },
      { text: "جميع القوالب المميزة", included: true, icon: Crown },
      { text: "دعم أولوية 24/7", included: true, icon: Headphones },
      { text: "حتى 5 مديرين", included: true, icon: Users },
      { text: "فيسبوك بيكسل + Google Analytics", included: true, icon: Activity },
      { text: "دومين مخصص", included: true, icon: Globe },
      { text: "تقارير متقدمة", included: true, icon: Star },
      { text: "حماية SSL مجانية", included: true, icon: Shield },
    ],
    cta: "ترقية الآن",
  },
];

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === "pro") {
      toast({ title: "ترقية الباقة", description: "سيتم توجيهك لإتمام الدفع" });
    }
  };

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

        {/* Plans Cards */}
        <div className="space-y-4">
          {PLANS.map((plan) => {
            const price = billingPeriod === "yearly" ? Math.round(plan.price * 0.8) : plan.price;
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-card border-2 rounded-2xl overflow-hidden transition-all ${
                  plan.popular ? "border-primary shadow-sm" : isSelected ? "border-primary/50" : "border-border"
                }`}
              >
                {plan.badge && (
                  <div className="bg-primary text-primary-foreground text-[10px] font-bold text-center py-1.5">
                    ⭐ {plan.badge}
                  </div>
                )}

                <div className="p-5">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
                    </div>
                    {plan.popular && <Crown className="h-5 w-5 text-primary" />}
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">
                        {price.toLocaleString("ar-IQ")}
                      </span>
                      <span className="text-sm text-muted-foreground">د.ع / {billingPeriod === "monthly" ? "شهر" : "شهر"}</span>
                    </div>
                    {billingPeriod === "yearly" && (
                      <p className="text-[11px] text-success mt-1">
                        توفير {((plan.price * 12 * 0.2)).toLocaleString("ar-IQ")} د.ع سنوياً
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full mb-5"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {isSelected && plan.id === "basic" ? "✓ الباقة الحالية" : plan.cta}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground">المميزات</p>
                    {plan.features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <div
                          key={feature.text}
                          className={`flex items-center gap-2.5 ${!feature.included ? "opacity-40" : ""}`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            feature.included ? "bg-success/10" : "bg-muted"
                          }`}>
                            {feature.included ? (
                              <Check className="h-3 w-3 text-success" />
                            ) : (
                              <span className="text-[10px] text-muted-foreground">✕</span>
                            )}
                          </div>
                          <span className="text-sm text-foreground">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
