import { useState } from "react";
import { 
  Check, Crown, Zap, Star, Shield, Truck, Users, Palette, Activity, 
  Ticket, Store, Globe, Headphones, Sparkles, X, Calendar, Clock, AlertTriangle, Gift, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { usePlan } from "@/hooks/usePlan";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/hooks/useLanguage";
import PlanCard from "@/components/plans/PlanCard";
import PlanFeatureList from "@/components/plans/PlanFeatureList";
import PlanComparison from "@/components/plans/PlanComparison";

type PlanId = "free" | "basic" | "pro";

const Plans = () => {
  const { plan, setPlan, subscription, daysRemaining, isExpiringSoon, isPaid } = usePlan();
  const { t, lang } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(plan);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(subscription.billingPeriod);
  const [showComparison, setShowComparison] = useState(false);

  const prices: Record<PlanId, { monthly: number; yearly: number }> = {
    free: { monthly: 0, yearly: 0 },
    basic: { monthly: 15000, yearly: 12000 },
    pro: { monthly: 35000, yearly: 28000 },
  };

  const currentPrice = prices[selectedPlan][billingPeriod];

  const handleSubscribe = () => {
    setPlan(selectedPlan, billingPeriod);
    if (selectedPlan === "pro" && plan !== "pro") {
      toast({ title: t.plans.upgraded, description: t.plans.upgradedDesc });
    } else if (selectedPlan === "basic" && plan !== "basic") {
      toast({ title: t.plans.changed, description: t.plans.changedDesc });
    } else if (selectedPlan === "free") {
      toast({ title: t.plans.switchedFree });
    } else {
      toast({ title: t.plans.renewed });
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString(lang === "ku" ? "ckb-IQ" : "ar-IQ", { year: "numeric", month: "long", day: "numeric" });

  const getButtonLabel = () => {
    if (selectedPlan === plan) return t.plans.currentPlanBtn;
    if (selectedPlan === "pro") return t.plans.upgradeToPro;
    if (selectedPlan === "basic") return plan === "free" ? t.plans.upgradeToBasic : t.plans.changeToBasic;
    return t.plans.switchToFree;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={t.plans.title} subtitle={t.plans.subtitle} />

      <main className="container mx-auto px-4 pt-4 space-y-5">
        {/* Subscription Status - only for paid plans */}
        {isPaid && (
          <div className={`border rounded-2xl p-4 space-y-3 ${isExpiringSoon ? "bg-destructive/5 border-destructive/30" : "bg-primary/5 border-primary/20"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isExpiringSoon ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <Sparkles className="h-4 w-4 text-primary" />}
                <span className="text-xs font-bold text-foreground">
                  {t.plans.currentPlan}: {plan === "basic" ? t.plans.basic : t.plans.pro}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isExpiringSoon ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                {isExpiringSoon ? t.plans.expiringSoon : t.plans.active}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/60 rounded-xl p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="h-3 w-3" /><span className="text-[10px]">{t.plans.startDate}</span></div>
                <p className="text-[11px] font-semibold text-foreground">{formatDate(subscription.startDate)}</p>
              </div>
              <div className="bg-background/60 rounded-xl p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="h-3 w-3" /><span className="text-[10px]">{t.plans.endDate}</span></div>
                <p className="text-[11px] font-semibold text-foreground">{formatDate(subscription.endDate)}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-muted-foreground" /><span className="text-[10px] text-muted-foreground">{t.plans.remaining}</span></div>
                <span className={`text-xs font-bold ${isExpiringSoon ? "text-destructive" : "text-foreground"}`}>{daysRemaining} {t.plans.days}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isExpiringSoon ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min(100, (daysRemaining / (subscription.billingPeriod === "yearly" ? 365 : 30)) * 100)}%` }} />
              </div>
            </div>
            {isExpiringSoon && (
              <div className="bg-destructive/10 rounded-lg p-2.5 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                <p className="text-[11px] text-destructive font-medium">{t.plans.expiryWarning} {daysRemaining} {t.plans.days}. {t.plans.renewNow}</p>
              </div>
            )}
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-1 bg-secondary rounded-xl p-1">
          <button onClick={() => setBillingPeriod("monthly")} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${billingPeriod === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{t.plans.monthly}</button>
          <button onClick={() => setBillingPeriod("yearly")} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${billingPeriod === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            {t.plans.yearly}
            <span className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-bold">{t.plans.save20}</span>
          </button>
        </div>

        {/* Plan Cards */}
        <div className="space-y-3">
          {/* Free */}
          <PlanCard
            planId="free"
            selected={selectedPlan === "free"}
            isCurrent={plan === "free"}
            icon={<Gift className="h-4 w-4 text-muted-foreground" />}
            title={t.plans.free}
            description={t.plans.freeDesc}
            price={0}
            billingPeriod={billingPeriod}
            currency={t.currency}
            perMonth={t.plans.perMonth}
            currentLabel={t.plans.current}
            freeLabel={t.plans.freePrice}
            onSelect={() => setSelectedPlan("free")}
          />

          {/* Basic */}
          <PlanCard
            planId="basic"
            selected={selectedPlan === "basic"}
            isCurrent={plan === "basic"}
            icon={<Zap className="h-4 w-4 text-primary" />}
            title={t.plans.basic}
            description={t.plans.basicDesc}
            price={prices.basic[billingPeriod]}
            billingPeriod={billingPeriod}
            currency={t.currency}
            perMonth={t.plans.perMonth}
            currentLabel={t.plans.current}
            onSelect={() => setSelectedPlan("basic")}
          />

          {/* Pro */}
          <PlanCard
            planId="pro"
            selected={selectedPlan === "pro"}
            isCurrent={plan === "pro"}
            icon={<Crown className="h-4 w-4 text-primary" />}
            title={t.plans.pro}
            description={t.plans.proDesc}
            price={prices.pro[billingPeriod]}
            billingPeriod={billingPeriod}
            currency={t.currency}
            perMonth={t.plans.perMonth}
            currentLabel={t.plans.current}
            badge={t.plans.mostPopular}
            onSelect={() => setSelectedPlan("pro")}
          />
        </div>

        <Button onClick={handleSubscribe} className="w-full h-12 rounded-xl font-bold" size="lg" disabled={selectedPlan === plan}>
          {getButtonLabel()}
        </Button>

        {/* Features */}
        <PlanFeatureList selectedPlan={selectedPlan} lang={lang} featuresLabel={t.plans.features} planLabels={{ free: t.plans.free, basic: t.plans.basic, pro: t.plans.pro }} />

        {/* Comparison */}
        <button onClick={() => setShowComparison(!showComparison)} className="w-full text-center text-xs font-bold text-primary py-2">
          {showComparison ? t.plans.hideComparison : t.plans.comparePlans}
        </button>

        {showComparison && <PlanComparison lang={lang} labels={{ feature: t.plans.feature, free: t.plans.free, basic: t.plans.basic, pro: t.plans.pro }} />}

        {/* FAQ */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t.plans.faq}</h3>
          {(lang === "ku" ? FAQ_KU : FAQ_AR).map((faq) => (
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

const FAQ_AR = [
  { q: "هل يمكنني التغيير بين الباقات؟", a: "نعم، يمكنك الترقية أو التخفيض في أي وقت." },
  { q: "هل هناك فترة تجريبية؟", a: "نعم، نقدم 14 يوم تجربة مجانية للباقة الاحترافية." },
  { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل الدفع عبر زين كاش، آسيا حوالة، وبطاقات الائتمان." },
  { q: "ما الفرق بين المجانية والأساسية؟", a: "المجانية تناسب البداية مع ميزات محدودة، والأساسية تفتح لك ميزات أكثر مثل منتجات ومتاجر إضافية." },
];

const FAQ_KU = [
  { q: "دەتوانم لەنێو پلانەکاندا بگۆڕم؟", a: "بەڵێ، لە هەر کاتێکدا دەتوانیت بەرزبکەیتەوە یان دابەزیت." },
  { q: "ماوەی تاقیکردنەوە هەیە؟", a: "بەڵێ، ١٤ ڕۆژ تاقیکردنەوەی بێبەرامبەر بۆ پلانی پیشەیی." },
  { q: "چ ڕێگایەکی پارەدان بەردەستە؟", a: "پارەدان بە زەین کاش، ئاسیا حەوالە، و کارتی بانکی." },
  { q: "جیاوازی نێوان بێبەرامبەر و بنچینەیی چییە؟", a: "بێبەرامبەر گونجاوە بۆ دەستپێکردن بە تایبەتمەندی سنووردار، و بنچینەیی تایبەتمەندی زیاتر دەکاتەوە." },
];

export default Plans;
