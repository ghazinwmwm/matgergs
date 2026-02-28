import { useState } from "react";
import { 
  Check, Crown, Zap, Star, Shield, Truck, Users, Palette, Activity, 
  Ticket, Store, Globe, Headphones, Sparkles, X, Calendar, Clock, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { usePlan } from "@/hooks/usePlan";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/hooks/useLanguage";

const BASIC_FEATURES_KEYS = [
  { textAr: "متجر واحد", textKu: "یەک فرۆشگا", icon: Store, included: true },
  { textAr: "50 منتج كحد أقصى", textKu: "٥٠ بەرهەم وەک زۆرینە", icon: Zap, included: true },
  { textAr: "أكواد خصم غير محدودة", textKu: "کۆدی داشکاندنی بێسنوور", icon: Ticket, included: true },
  { textAr: "شركة توصيل واحدة", textKu: "یەک کۆمپانیای گەیاندن", icon: Truck, included: true },
  { textAr: "قالب مجاني واحد", textKu: "یەک داڕشتەی بێبەرامبەر", icon: Palette, included: true },
  { textAr: "دعم عبر البريد", textKu: "پشتگیری بە ئیمەیل", icon: Headphones, included: true },
  { textAr: "متاجر متعددة", textKu: "فرۆشگای فرە", icon: Store, included: false },
  { textAr: "فريق عمل (مديرين)", textKu: "تیمی کار (بەڕێوەبەران)", icon: Users, included: false },
  { textAr: "بيكسل وتتبع", textKu: "پیکسەل و شوێنکەوتن", icon: Activity, included: false },
  { textAr: "دومين مخصص", textKu: "دۆمەینی تایبەت", icon: Globe, included: false },
  { textAr: "قوالب مميزة", textKu: "داڕشتە تایبەتەکان", icon: Crown, included: false },
];

const PRO_FEATURES_KEYS = [
  { textAr: "متاجر غير محدودة", textKu: "فرۆشگای بێسنوور", icon: Store, included: true },
  { textAr: "منتجات غير محدودة", textKu: "بەرهەمی بێسنوور", icon: Zap, included: true },
  { textAr: "أكواد خصم غير محدودة", textKu: "کۆدی داشکاندنی بێسنوور", icon: Ticket, included: true },
  { textAr: "جميع شركات التوصيل", textKu: "هەموو کۆمپانیاکانی گەیاندن", icon: Truck, included: true },
  { textAr: "جميع القوالب المميزة", textKu: "هەموو داڕشتە تایبەتەکان", icon: Crown, included: true },
  { textAr: "دعم أولوية 24/7", textKu: "پشتگیری ئەولەویەت ٢٤/٧", icon: Headphones, included: true },
  { textAr: "حتى 5 مديرين", textKu: "تا ٥ بەڕێوەبەر", icon: Users, included: true },
  { textAr: "فيسبوك بيكسل + Google Analytics", textKu: "فەیسبوک پیکسەل + Google Analytics", icon: Activity, included: true },
  { textAr: "دومين مخصص", textKu: "دۆمەینی تایبەت", icon: Globe, included: true },
  { textAr: "تقارير متقدمة", textKu: "ڕاپۆرتی پێشکەوتوو", icon: Star, included: true },
  { textAr: "حماية SSL مجانية", textKu: "پاراستنی SSL بێبەرامبەر", icon: Shield, included: true },
];

const COMPARISON_KEYS = [
  { featureAr: "عدد المتاجر", featureKu: "ژمارەی فرۆشگاکان", basic: "1", proAr: "غير محدود", proKu: "بێسنوور" },
  { featureAr: "عدد المنتجات", featureKu: "ژمارەی بەرهەمەکان", basic: "50", proAr: "غير محدود", proKu: "بێسنوور" },
  { featureAr: "أكواد الخصم", featureKu: "کۆدی داشکاندن", basicAr: "غير محدود", basicKu: "بێسنوور", proAr: "غير محدود", proKu: "بێسنوور" },
  { featureAr: "شركات التوصيل", featureKu: "کۆمپانیای گەیاندن", basic: "1", proAr: "الكل", proKu: "هەموو" },
  { featureAr: "أعضاء الفريق", featureKu: "ئەندامانی تیم", basic: "—", pro: "5" },
  { featureAr: "القوالب", featureKu: "داڕشتەکان", basicAr: "مجاني واحد", basicKu: "یەک بێبەرامبەر", proAr: "الكل", proKu: "هەموو" },
  { featureAr: "بيكسل وتتبع", featureKu: "پیکسەل و شوێنکەوتن", basic: "—", pro: "✓" },
  { featureAr: "دومين مخصص", featureKu: "دۆمەینی تایبەت", basic: "—", pro: "✓" },
  { featureAr: "تقارير متقدمة", featureKu: "ڕاپۆرتی پێشکەوتوو", basic: "—", pro: "✓" },
  { featureAr: "الدعم", featureKu: "پشتگیری", basicAr: "بريد", basicKu: "ئیمەیل", pro: "24/7" },
];

const FAQ_AR = [
  { q: "هل يمكنني التغيير بين الباقات؟", a: "نعم، يمكنك الترقية أو التخفيض في أي وقت." },
  { q: "هل هناك فترة تجريبية؟", a: "نعم، نقدم 14 يوم تجربة مجانية للباقة الاحترافية." },
  { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل الدفع عبر زين كاش، آسيا حوالة، وبطاقات الائتمان." },
];

const FAQ_KU = [
  { q: "دەتوانم لەنێو پلانەکاندا بگۆڕم؟", a: "بەڵێ، لە هەر کاتێکدا دەتوانیت بەرزبکەیتەوە یان دابەزیت." },
  { q: "ماوەی تاقیکردنەوە هەیە؟", a: "بەڵێ، ١٤ ڕۆژ تاقیکردنەوەی بێبەرامبەر بۆ پلانی پیشەیی." },
  { q: "چ ڕێگایەکی پارەدان بەردەستە؟", a: "پارەدان بە زەین کاش، ئاسیا حەوالە، و کارتی بانکی." },
];

const Plans = () => {
  const { plan, setPlan, subscription, daysRemaining, isExpiringSoon } = usePlan();
  const { t, lang } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState(plan);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(subscription.billingPeriod);
  const [showComparison, setShowComparison] = useState(false);

  const basicPrice = billingPeriod === "yearly" ? 12000 : 15000;
  const proPrice = billingPeriod === "yearly" ? 28000 : 35000;

  const handleSelectPlan = (planId: "basic" | "pro") => setSelectedPlan(planId);

  const handleSubscribe = () => {
    setPlan(selectedPlan as "basic" | "pro", billingPeriod);
    if (selectedPlan === "pro" && plan !== "pro") {
      toast({ title: t.plans.upgraded, description: t.plans.upgradedDesc });
    } else if (selectedPlan === "basic" && plan !== "basic") {
      toast({ title: t.plans.changed, description: t.plans.changedDesc });
    } else {
      toast({ title: t.plans.renewed });
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString(lang === "ku" ? "ckb-IQ" : "ar-IQ", { year: "numeric", month: "long", day: "numeric" });

  const currentFeatures = selectedPlan === "basic" ? BASIC_FEATURES_KEYS : PRO_FEATURES_KEYS;
  const faqList = lang === "ku" ? FAQ_KU : FAQ_AR;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={t.plans.title} subtitle={t.plans.subtitle} />

      <main className="container mx-auto px-4 pt-4 space-y-5">
        {/* Subscription Status */}
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
          <div onClick={() => handleSelectPlan("basic")} className={`bg-card border-2 rounded-2xl p-5 transition-all cursor-pointer ${selectedPlan === "basic" ? "border-primary shadow-sm" : "border-border"}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === "basic" ? "border-primary" : "border-muted-foreground/30"}`}>
                  {selectedPlan === "basic" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <h3 className="text-base font-bold text-foreground">{t.plans.basic}</h3>
                {plan === "basic" && <span className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-bold">{t.plans.current}</span>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{t.plans.basicDesc}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{basicPrice.toLocaleString("ar-IQ")}</span>
              <span className="text-xs text-muted-foreground">{t.currency} {t.plans.perMonth}</span>
            </div>
          </div>

          <div onClick={() => handleSelectPlan("pro")} className={`bg-card border-2 rounded-2xl overflow-hidden transition-all cursor-pointer ${selectedPlan === "pro" ? "border-primary shadow-sm" : "border-border"}`}>
            <div className="bg-primary text-primary-foreground text-[10px] font-bold text-center py-1.5">{t.plans.mostPopular}</div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === "pro" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {selectedPlan === "pro" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <h3 className="text-base font-bold text-foreground">{t.plans.pro}</h3>
                  <Crown className="h-4 w-4 text-primary" />
                  {plan === "pro" && <span className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-bold">{t.plans.current}</span>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{t.plans.proDesc}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{proPrice.toLocaleString("ar-IQ")}</span>
                <span className="text-xs text-muted-foreground">{t.currency} {t.plans.perMonth}</span>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSubscribe} className="w-full h-12 rounded-xl font-bold" size="lg">
          {selectedPlan === plan ? t.plans.currentPlanBtn : selectedPlan === "pro" ? t.plans.upgradeToPro : t.plans.changeToBasic}
        </Button>

        {/* Features */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">{t.plans.features} {selectedPlan === "basic" ? t.plans.basic : t.plans.pro}</h3>
          </div>
          <div className="space-y-3">
            {currentFeatures.map((feature) => (
              <div key={feature.textAr} className={`flex items-center gap-2.5 ${!feature.included ? "opacity-35" : ""}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${feature.included ? "bg-success/10" : "bg-muted"}`}>
                  {feature.included ? <Check className="h-3 w-3 text-success" /> : <X className="h-3 w-3 text-muted-foreground" />}
                </div>
                <span className="text-sm text-foreground">{lang === "ku" ? feature.textKu : feature.textAr}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <button onClick={() => setShowComparison(!showComparison)} className="w-full text-center text-xs font-bold text-primary py-2">
          {showComparison ? t.plans.hideComparison : t.plans.comparePlans}
        </button>

        {showComparison && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 text-center bg-secondary/50 py-2.5 border-b border-border">
              <span className="text-[11px] font-semibold text-muted-foreground">{t.plans.feature}</span>
              <span className="text-[11px] font-bold text-foreground">{t.plans.basic}</span>
              <span className="text-[11px] font-bold text-primary">{t.plans.pro}</span>
            </div>
            {COMPARISON_KEYS.map((row, i) => (
              <div key={row.featureAr} className={`grid grid-cols-3 text-center py-2.5 px-2 ${i < COMPARISON_KEYS.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-[11px] text-foreground text-right pr-2">{lang === "ku" ? row.featureKu : row.featureAr}</span>
                <span className="text-[11px] text-muted-foreground">{lang === "ku" ? (row.basicKu || row.basic) : (row.basicAr || row.basic)}</span>
                <span className="text-[11px] text-primary font-medium">{lang === "ku" ? (row.proKu || row.pro) : (row.proAr || row.pro)}</span>
              </div>
            ))}
          </div>
        )}

        {/* FAQ */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t.plans.faq}</h3>
          {faqList.map((faq) => (
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
