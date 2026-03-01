import { Check, X, Store, Zap, Ticket, Truck, Palette, Headphones, Users, Activity, Globe, Crown, Star, Shield, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type PlanId = "free" | "basic" | "pro";
type Tier = "free" | "basic" | "pro";

interface Feature {
  textAr: string;
  textKu: string;
  icon: any;
  free: boolean;
  basic: boolean;
  pro: boolean;
  /** Which tier this feature "belongs to" visually */
  tier: Tier;
}

const FEATURES: Feature[] = [
  { textAr: "متجر واحد", textKu: "یەک فرۆشگا", icon: Store, free: true, basic: true, pro: true, tier: "free" },
  { textAr: "20 منتج", textKu: "٢٠ بەرهەم", icon: Zap, free: true, basic: false, pro: false, tier: "free" },
  { textAr: "شركة توصيل واحدة", textKu: "یەک کۆمپانیای گەیاندن", icon: Truck, free: true, basic: true, pro: false, tier: "free" },
  { textAr: "قالب مجاني واحد", textKu: "یەک داڕشتەی بێبەرامبەر", icon: Palette, free: true, basic: true, pro: false, tier: "free" },
  { textAr: "دعم عبر البريد", textKu: "پشتگیری بە ئیمەیل", icon: Headphones, free: true, basic: true, pro: false, tier: "free" },

  { textAr: "100 منتج", textKu: "١٠٠ بەرهەم", icon: Zap, free: false, basic: true, pro: false, tier: "basic" },
  { textAr: "أكواد خصم غير محدودة", textKu: "کۆدی داشکاندنی بێسنوور", icon: Ticket, free: false, basic: true, pro: true, tier: "basic" },
  { textAr: "متاجر متعددة (حتى 3)", textKu: "فرۆشگای فرە (تا ٣)", icon: Store, free: false, basic: true, pro: false, tier: "basic" },
  { textAr: "حتى 2 مديرين", textKu: "تا ٢ بەڕێوەبەر", icon: Users, free: false, basic: true, pro: false, tier: "basic" },
  { textAr: "حماية SSL مجانية", textKu: "پاراستنی SSL بێبەرامبەر", icon: Shield, free: false, basic: true, pro: true, tier: "basic" },

  { textAr: "منتجات غير محدودة", textKu: "بەرهەمی بێسنوور", icon: Zap, free: false, basic: false, pro: true, tier: "pro" },
  { textAr: "جميع شركات التوصيل", textKu: "هەموو کۆمپانیاکانی گەیاندن", icon: Truck, free: false, basic: false, pro: true, tier: "pro" },
  { textAr: "جميع القوالب المميزة", textKu: "هەموو داڕشتە تایبەتەکان", icon: Crown, free: false, basic: false, pro: true, tier: "pro" },
  { textAr: "دعم أولوية 24/7", textKu: "پشتگیری ئەولەویەت ٢٤/٧", icon: Headphones, free: false, basic: false, pro: true, tier: "pro" },
  { textAr: "متاجر غير محدودة", textKu: "فرۆشگای بێسنوور", icon: Store, free: false, basic: false, pro: true, tier: "pro" },
  { textAr: "حتى 5 مديرين", textKu: "تا ٥ بەڕێوەبەر", icon: Users, free: false, basic: false, pro: true, tier: "pro" },
  { textAr: "بيكسل وتتبع", textKu: "پیکسەل و شوێنکەوتن", icon: Activity, free: false, basic: false, pro: true, tier: "pro" },
  { textAr: "دومين مخصص", textKu: "دۆمەینی تایبەت", icon: Globe, free: false, basic: false, pro: true, tier: "pro" },
  { textAr: "تقارير متقدمة", textKu: "ڕاپۆرتی پێشکەوتوو", icon: Star, free: false, basic: false, pro: true, tier: "pro" },
];

const TIER_STYLES: Record<Tier, { labelAr: string; labelKu: string; badgeClass: string }> = {
  free: { labelAr: "مجانية", labelKu: "بێبەرامبەر", badgeClass: "bg-muted text-muted-foreground" },
  basic: { labelAr: "أساسية", labelKu: "بنچینەیی", badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  pro: { labelAr: "احترافية", labelKu: "پیشەیی", badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
};

interface Props {
  selectedPlan: PlanId;
  lang: string;
  featuresLabel: string;
  planLabels: Record<PlanId, string>;
}

const PlanFeatureList = ({ selectedPlan, lang, featuresLabel, planLabels }: Props) => {
  const included = FEATURES.filter(f => f[selectedPlan]);
  const notIncluded = FEATURES.filter(f => !f[selectedPlan]);

  // Group included features by tier
  const tiers: Tier[] = ["free", "basic", "pro"];
  const grouped = tiers
    .map(tier => ({
      tier,
      features: included.filter(f => f.tier === tier),
    }))
    .filter(g => g.features.length > 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">{featuresLabel} {planLabels[selectedPlan]}</h3>
      </div>
      <div className="space-y-4">
        {grouped.map(({ tier, features }) => {
          const style = TIER_STYLES[tier];
          return (
            <div key={tier} className="space-y-2.5">
              {/* Tier section header */}
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${style.badgeClass}`}>
                  {lang === "ku" ? style.labelKu : style.labelAr}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.textAr} className="flex items-center gap-2.5 pr-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-success/10">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">{lang === "ku" ? feature.textKu : feature.textAr}</span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Not included */}
        {notIncluded.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                {lang === "ku" ? "بەردەست نییە" : "غير متاحة"}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            {notIncluded.slice(0, 4).map((feature) => {
              const Icon = feature.icon;
              const tierStyle = TIER_STYLES[feature.tier];
              return (
                <div key={feature.textAr} className="flex items-center gap-2.5 pr-1 opacity-40">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
                    <X className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">{lang === "ku" ? feature.textKu : feature.textAr}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full mr-auto ${tierStyle.badgeClass}`}>
                    {lang === "ku" ? tierStyle.labelKu : tierStyle.labelAr}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanFeatureList;
