interface CompRow {
  featureAr: string;
  featureKu: string;
  free: string;
  basic: string;
  pro: string;
}

const ROWS: CompRow[] = [
  { featureAr: "عدد المتاجر", featureKu: "ژمارەی فرۆشگاکان", free: "1", basic: "3", pro: "∞" },
  { featureAr: "عدد المنتجات", featureKu: "ژمارەی بەرهەمەکان", free: "20", basic: "100", pro: "∞" },
  { featureAr: "أكواد الخصم", featureKu: "کۆدی داشکاندن", free: "5", basic: "∞", pro: "∞" },
  { featureAr: "شركات التوصيل", featureKu: "کۆمپانیای گەیاندن", free: "1", basic: "1", pro: "∞" },
  { featureAr: "أعضاء الفريق", featureKu: "ئەندامانی تیم", free: "—", basic: "2", pro: "5" },
  { featureAr: "القوالب", featureKu: "داڕشتەکان", free: "1", basic: "1", pro: "∞" },
  { featureAr: "بيكسل وتتبع", featureKu: "پیکسەل و شوێنکەوتن", free: "—", basic: "—", pro: "✓" },
  { featureAr: "دومين مخصص", featureKu: "دۆمەینی تایبەت", free: "—", basic: "—", pro: "✓" },
  { featureAr: "تقارير متقدمة", featureKu: "ڕاپۆرتی پێشکەوتوو", free: "—", basic: "—", pro: "✓" },
  { featureAr: "SSL", featureKu: "SSL", free: "—", basic: "✓", pro: "✓" },
  { featureAr: "الدعم", featureKu: "پشتگیری", free: "بريد", basic: "بريد", pro: "24/7" },
];

interface Props {
  lang: string;
  labels: { feature: string; free: string; basic: string; pro: string };
}

const PlanComparison = ({ lang, labels }: Props) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden">
    <div className="grid grid-cols-4 text-center bg-secondary/50 py-2.5 border-b border-border">
      <span className="text-[11px] font-semibold text-muted-foreground">{labels.feature}</span>
      <span className="text-[11px] font-bold text-foreground">{labels.free}</span>
      <span className="text-[11px] font-bold text-foreground">{labels.basic}</span>
      <span className="text-[11px] font-bold text-primary">{labels.pro}</span>
    </div>
    {ROWS.map((row, i) => (
      <div key={row.featureAr} className={`grid grid-cols-4 text-center py-2.5 px-2 ${i < ROWS.length - 1 ? "border-b border-border" : ""}`}>
        <span className="text-[11px] text-foreground text-right pr-2">{lang === "ku" ? row.featureKu : row.featureAr}</span>
        <span className="text-[11px] text-muted-foreground">{row.free}</span>
        <span className="text-[11px] text-muted-foreground">{row.basic}</span>
        <span className="text-[11px] text-primary font-medium">{row.pro}</span>
      </div>
    ))}
  </div>
);

export default PlanComparison;
