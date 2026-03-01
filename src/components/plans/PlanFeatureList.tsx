import { Check, X, Store, Zap, Ticket, Truck, Palette, Headphones, Users, Activity, Globe, Crown, Star, Shield, Sparkles } from "lucide-react";

type PlanId = "free" | "basic" | "pro";

interface Feature {
  textAr: string;
  textKu: string;
  icon: any;
  free: boolean;
  basic: boolean;
  pro: boolean;
}

const FEATURES: Feature[] = [
  { textAr: "متجر واحد", textKu: "یەک فرۆشگا", icon: Store, free: true, basic: true, pro: true },
  { textAr: "20 منتج", textKu: "٢٠ بەرهەم", icon: Zap, free: true, basic: false, pro: false },
  { textAr: "100 منتج", textKu: "١٠٠ بەرهەم", icon: Zap, free: false, basic: true, pro: false },
  { textAr: "منتجات غير محدودة", textKu: "بەرهەمی بێسنوور", icon: Zap, free: false, basic: false, pro: true },
  { textAr: "أكواد خصم (5)", textKu: "کۆدی داشکاندن (٥)", icon: Ticket, free: true, basic: false, pro: false },
  { textAr: "أكواد خصم غير محدودة", textKu: "کۆدی داشکاندنی بێسنوور", icon: Ticket, free: false, basic: true, pro: true },
  { textAr: "شركة توصيل واحدة", textKu: "یەک کۆمپانیای گەیاندن", icon: Truck, free: true, basic: true, pro: false },
  { textAr: "جميع شركات التوصيل", textKu: "هەموو کۆمپانیاکانی گەیاندن", icon: Truck, free: false, basic: false, pro: true },
  { textAr: "قالب مجاني واحد", textKu: "یەک داڕشتەی بێبەرامبەر", icon: Palette, free: true, basic: true, pro: false },
  { textAr: "جميع القوالب المميزة", textKu: "هەموو داڕشتە تایبەتەکان", icon: Crown, free: false, basic: false, pro: true },
  { textAr: "دعم عبر البريد", textKu: "پشتگیری بە ئیمەیل", icon: Headphones, free: true, basic: true, pro: false },
  { textAr: "دعم أولوية 24/7", textKu: "پشتگیری ئەولەویەت ٢٤/٧", icon: Headphones, free: false, basic: false, pro: true },
  { textAr: "متاجر متعددة (حتى 3)", textKu: "فرۆشگای فرە (تا ٣)", icon: Store, free: false, basic: true, pro: false },
  { textAr: "متاجر غير محدودة", textKu: "فرۆشگای بێسنوور", icon: Store, free: false, basic: false, pro: true },
  { textAr: "حتى 2 مديرين", textKu: "تا ٢ بەڕێوەبەر", icon: Users, free: false, basic: true, pro: false },
  { textAr: "حتى 5 مديرين", textKu: "تا ٥ بەڕێوەبەر", icon: Users, free: false, basic: false, pro: true },
  { textAr: "بيكسل وتتبع", textKu: "پیکسەل و شوێنکەوتن", icon: Activity, free: false, basic: false, pro: true },
  { textAr: "دومين مخصص", textKu: "دۆمەینی تایبەت", icon: Globe, free: false, basic: false, pro: true },
  { textAr: "تقارير متقدمة", textKu: "ڕاپۆرتی پێشکەوتوو", icon: Star, free: false, basic: false, pro: true },
  { textAr: "حماية SSL مجانية", textKu: "پاراستنی SSL بێبەرامبەر", icon: Shield, free: false, basic: true, pro: true },
];

interface Props {
  selectedPlan: PlanId;
  lang: string;
  featuresLabel: string;
  planLabels: Record<PlanId, string>;
}

const PlanFeatureList = ({ selectedPlan, lang, featuresLabel, planLabels }: Props) => {
  const filtered = FEATURES.filter(f => f[selectedPlan]);

  const notIncluded = FEATURES.filter(f => !f[selectedPlan]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">{featuresLabel} {planLabels[selectedPlan]}</h3>
      </div>
      <div className="space-y-3">
        {filtered.map((feature) => (
          <div key={feature.textAr} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-success/10">
              <Check className="h-3 w-3 text-success" />
            </div>
            <span className="text-sm text-foreground">{lang === "ku" ? feature.textKu : feature.textAr}</span>
          </div>
        ))}
        {notIncluded.slice(0, 4).map((feature) => (
          <div key={feature.textAr} className="flex items-center gap-2.5 opacity-35">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
              <X className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-sm text-foreground">{lang === "ku" ? feature.textKu : feature.textAr}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanFeatureList;
