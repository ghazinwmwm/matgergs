import { HelpCircle, MessageCircle, Mail, FileText, ExternalLink, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/hooks/useLanguage";

const Help = () => {
  const { lang } = useLanguage();

  const faqs = lang === "ku" ? [
    { q: "چۆن بەرهەمێکی نوێ زیاد بکەم؟", a: "لە سەرەتا بچۆ بۆ بەرهەمەکان و دوگمەی 'زیادکردنی بەرهەم' دابگرە." },
    { q: "چۆن داواکارییەکان بەدواداچم؟", a: "لە بەشی داواکارییەکان دەتوانیت هەموو داواکارییەکان ببینیت و دۆخیان بگۆڕیت." },
    { q: "چۆن پلانەکەم بەرزبکەمەوە؟", a: "بچۆ بۆ زیاتر > حسابی > پلان و بەشداریکردن." },
  ] : [
    { q: "كيف أضيف منتج جديد؟", a: "من الصفحة الرئيسية انتقل إلى المنتجات واضغط على زر 'إضافة منتج'." },
    { q: "كيف أتابع الطلبات؟", a: "من قسم الطلبات يمكنك عرض جميع الطلبات وتغيير حالتها." },
    { q: "كيف أرقّي باقتي؟", a: "انتقل إلى المزيد > حسابي > الباقة والاشتراك." },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={lang === "ku" ? "یارمەتی" : "المساعدة"} />

      <main className="container mx-auto px-4 pt-4 space-y-5">
        {/* Contact */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground">
            {lang === "ku" ? "پەیوەندیمان پێوە بکە" : "تواصل معنا"}
          </h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => window.open("https://wa.me/9647700000000", "_blank")}>
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{lang === "ku" ? "واتسئاپ" : "واتساب"}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground mr-auto" />
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => window.open("mailto:support@matager.store")}>
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm">support@matager.store</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground mr-auto" />
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <HelpCircle className="h-3 w-3" />
            {lang === "ku" ? "پرسیارە باوەکان" : "الأسئلة الشائعة"}
          </h3>
          <div className="space-y-0 divide-y divide-border">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium text-foreground">{faq.q}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Docs */}
        <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => window.open("https://docs.matager.store", "_blank")}>
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{lang === "ku" ? "بەڵگەنامەکان" : "التوثيق والمستندات"}</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground mr-auto" />
        </Button>
      </main>
    </div>
  );
};

export default Help;
