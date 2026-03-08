import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Search, ShoppingCart, Menu, Star, Package, Heart, Share2, MapPin, Phone, Mail, ChevronLeft, FileText, Download, Play, Calendar, Clock, User, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES, Template } from "@/data/templates";
import { toast } from "@/hooks/use-toast";

const TemplatePreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const template = TEMPLATES.find((t) => t.id === id);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-sm text-muted-foreground">القالب غير موجود</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/templates")}>
            العودة للقوالب
          </Button>
        </div>
      </div>
    );
  }

  const [bg, primary, accent] = template.colors;
  const accentColor = accent || primary;

  const applyTemplate = () => {
    toast({ title: "تم تطبيق القالب ✓", description: `تم تطبيق قالب "${template.name}" بنجاح` });
    navigate("/templates");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg }}>
      {/* Fixed top bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/templates")} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-foreground" />
          </button>
          <div>
            <p className="text-xs font-bold text-foreground">معاينة: {template.name}</p>
            <p className="text-[10px] text-muted-foreground">{template.description}</p>
          </div>
        </div>
        <Button onClick={applyTemplate} size="sm" className="gap-1 text-xs">
          <Palette className="h-3 w-3" /> تطبيق
        </Button>
      </div>

      {/* Template preview content */}
      <div className="flex-1">
        {template.type === "store" && <StorePreview bg={bg} primary={primary} accent={accentColor} template={template} />}
        {template.type === "digital" && <DigitalPreview bg={bg} primary={primary} accent={accentColor} template={template} />}
        {template.type === "service" && <ServicePreview bg={bg} primary={primary} accent={accentColor} template={template} />}
      </div>
    </div>
  );
};

interface PreviewProps {
  bg: string;
  primary: string;
  accent: string;
  template: Template;
}

const StorePreview = ({ bg, primary, accent }: PreviewProps) => (
  <div style={{ backgroundColor: bg, color: primary }}>
    {/* Navbar */}
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${primary}15` }}>
      <Menu className="h-5 w-5" style={{ color: primary }} />
      <span className="text-sm font-bold" style={{ color: primary }}>متجري الإلكتروني</span>
      <div className="flex gap-3">
        <Search className="h-5 w-5" style={{ color: primary }} />
        <ShoppingCart className="h-5 w-5" style={{ color: primary }} />
      </div>
    </div>

    {/* Hero banner */}
    <div className="relative px-5 py-10 text-center" style={{ background: `linear-gradient(135deg, ${accent}18, ${primary}10)` }}>
      <p className="text-xs font-medium mb-2" style={{ color: accent }}>✨ مجموعة جديدة</p>
      <h1 className="text-xl font-bold mb-2" style={{ color: primary }}>تسوق أحدث المنتجات</h1>
      <p className="text-xs mb-4 opacity-70" style={{ color: primary }}>خصومات تصل إلى ٥٠٪ على جميع المنتجات</p>
      <button className="px-6 py-2.5 rounded-full text-sm font-medium" style={{ backgroundColor: accent, color: bg }}>
        تسوق الآن
      </button>
    </div>

    {/* Categories */}
    <div className="flex gap-3 px-4 py-4 overflow-x-auto">
      {["الكل", "إلكترونيات", "ملابس", "إكسسوارات", "أحذية"].map((cat, i) => (
        <span key={cat} className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
          style={{ backgroundColor: i === 0 ? accent : `${primary}10`, color: i === 0 ? bg : primary }}>
          {cat}
        </span>
      ))}
    </div>

    {/* Products grid */}
    <div className="px-4 pb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold" style={{ color: primary }}>المنتجات الأكثر مبيعاً</h2>
        <span className="text-xs" style={{ color: accent }}>عرض الكل</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "سماعات لاسلكية", price: "٢٥٠", oldPrice: "٣٥٠", rating: 4.8 },
          { name: "حقيبة جلدية", price: "١٨٠", oldPrice: "٢٤٠", rating: 4.5 },
          { name: "ساعة ذكية", price: "٤٥٠", oldPrice: "٦٠٠", rating: 4.9 },
          { name: "نظارة شمسية", price: "١٢٠", oldPrice: "١٥٠", rating: 4.3 },
        ].map((product) => (
          <div key={product.name} className="rounded-xl overflow-hidden" style={{ backgroundColor: `${primary}05`, border: `1px solid ${primary}12` }}>
            <div className="h-32 relative flex items-center justify-center" style={{ backgroundColor: `${accent}08` }}>
              <Package className="h-10 w-10 opacity-15" style={{ color: primary }} />
              <button className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${bg}90` }}>
                <Heart className="h-3.5 w-3.5" style={{ color: primary }} />
              </button>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-2.5 w-2.5" style={{ color: accent, fill: s <= Math.floor(product.rating) ? accent : 'none' }} />
                ))}
                <span className="text-[9px] opacity-60" style={{ color: primary }}>({product.rating})</span>
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: primary }}>{product.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: accent }}>{product.price} د.ع</span>
                <span className="text-[10px] line-through opacity-40" style={{ color: primary }}>{product.oldPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Promo banner */}
    <div className="mx-4 mb-6 rounded-xl p-5 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
      <p className="text-lg font-bold mb-1" style={{ color: bg }}>خصم ٣٠٪</p>
      <p className="text-xs mb-3 opacity-80" style={{ color: bg }}>على أول طلب لك</p>
      <span className="px-4 py-1.5 rounded-full text-xs font-bold border" style={{ borderColor: `${bg}50`, color: bg }}>FIRST30</span>
    </div>

    {/* New arrivals */}
    <div className="px-4 pb-6">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>وصل حديثاً</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {["قميص كلاسيكي", "حذاء رياضي", "عطر فاخر"].map((name) => (
          <div key={name} className="flex-shrink-0 w-36 rounded-xl overflow-hidden" style={{ border: `1px solid ${primary}12` }}>
            <div className="h-28 flex items-center justify-center" style={{ backgroundColor: `${accent}08` }}>
              <Package className="h-8 w-8 opacity-15" style={{ color: primary }} />
            </div>
            <div className="p-2.5">
              <p className="text-[11px] font-medium" style={{ color: primary }}>{name}</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: accent }}>١٩٩ د.ع</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="px-4 py-6 text-center" style={{ backgroundColor: `${primary}08`, borderTop: `1px solid ${primary}10` }}>
      <p className="text-sm font-bold mb-3" style={{ color: primary }}>متجري الإلكتروني</p>
      <div className="flex justify-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" style={{ color: accent }} />
          <span className="text-[10px]" style={{ color: primary }}>٠٧٧٠١٢٣٤٥٦٧</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" style={{ color: accent }} />
          <span className="text-[10px]" style={{ color: primary }}>info@store.com</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5">
        <MapPin className="h-3 w-3" style={{ color: accent }} />
        <span className="text-[10px] opacity-60" style={{ color: primary }}>بغداد، العراق</span>
      </div>
    </div>
  </div>
);

const DigitalPreview = ({ bg, primary, accent }: PreviewProps) => (
  <div style={{ backgroundColor: bg, color: primary }}>
    {/* Navbar */}
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${primary}15` }}>
      <Menu className="h-5 w-5" style={{ color: primary }} />
      <span className="text-sm font-bold" style={{ color: primary }}>أكاديميتي</span>
      <Search className="h-5 w-5" style={{ color: primary }} />
    </div>

    {/* Hero */}
    <div className="px-5 py-10 text-center" style={{ background: `linear-gradient(180deg, ${accent}15, ${bg})` }}>
      <p className="text-xs font-medium mb-2" style={{ color: accent }}>🎓 تعلّم من أي مكان</p>
      <h1 className="text-xl font-bold mb-2" style={{ color: primary }}>منصة المحتوى الرقمي</h1>
      <p className="text-xs mb-4 opacity-70" style={{ color: primary }}>كتب إلكترونية، دورات تعليمية، وملفات رقمية</p>
      <button className="px-6 py-2.5 rounded-full text-sm font-medium" style={{ backgroundColor: accent, color: bg }}>
        استكشف المحتوى
      </button>
    </div>

    {/* Categories */}
    <div className="flex gap-3 px-4 py-4 overflow-x-auto">
      {["الكل", "دورات", "كتب", "قوالب", "أدوات"].map((cat, i) => (
        <span key={cat} className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: i === 0 ? accent : `${primary}10`, color: i === 0 ? bg : primary }}>
          {cat}
        </span>
      ))}
    </div>

    {/* Featured course */}
    <div className="px-4 mb-4">
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${primary}12` }}>
        <div className="h-40 flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${primary}15, ${accent}20)` }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}30` }}>
            <Play className="h-7 w-7" style={{ color: accent }} />
          </div>
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: accent, color: bg }}>الأكثر مبيعاً</span>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-bold mb-1" style={{ color: primary }}>دورة تصميم UI/UX الشاملة</h3>
          <p className="text-[11px] opacity-60 mb-2" style={{ color: primary }}>تعلم أساسيات وتقنيات التصميم الاحترافي</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" style={{ color: accent }} />
              <span className="text-[10px]" style={{ color: primary }}>١٢ ساعة</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" style={{ color: accent }} />
              <span className="text-[10px]" style={{ color: primary }}>٤٥ درس</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" style={{ color: accent }} />
              <span className="text-[10px]" style={{ color: primary }}>٣٢٠ طالب</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold" style={{ color: accent }}>٧٥,٠٠٠ د.ع</span>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: accent, color: bg }}>اشترك الآن</button>
          </div>
        </div>
      </div>
    </div>

    {/* Digital products grid */}
    <div className="px-4 pb-6">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>منتجات رقمية</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "كتاب التسويق الرقمي", type: "PDF", price: "١٥,٠٠٠" },
          { name: "قوالب تصميم سوشال", type: "PSD", price: "٢٥,٠٠٠" },
          { name: "دليل البرمجة", type: "PDF", price: "٢٠,٠٠٠" },
          { name: "حزمة أيقونات", type: "SVG", price: "١٠,٠٠٠" },
        ].map((product) => (
          <div key={product.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${primary}12` }}>
            <div className="h-24 flex flex-col items-center justify-center gap-1" style={{ backgroundColor: `${accent}08` }}>
              <FileText className="h-8 w-8 opacity-20" style={{ color: primary }} />
              <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${accent}20`, color: accent }}>{product.type}</span>
            </div>
            <div className="p-3">
              <p className="text-[11px] font-medium mb-1" style={{ color: primary }}>{product.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: accent }}>{product.price} د.ع</span>
                <Download className="h-3.5 w-3.5" style={{ color: accent }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="px-4 py-6 text-center" style={{ backgroundColor: `${primary}08`, borderTop: `1px solid ${primary}10` }}>
      <p className="text-sm font-bold mb-2" style={{ color: primary }}>أكاديميتي الرقمية</p>
      <p className="text-[10px] opacity-60" style={{ color: primary }}>محتوى رقمي عربي متميز</p>
    </div>
  </div>
);

const ServicePreview = ({ bg, primary, accent }: PreviewProps) => (
  <div style={{ backgroundColor: bg, color: primary }}>
    {/* Navbar */}
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${primary}15` }}>
      <Menu className="h-5 w-5" style={{ color: primary }} />
      <span className="text-sm font-bold" style={{ color: primary }}>خدماتي</span>
      <Phone className="h-5 w-5" style={{ color: primary }} />
    </div>

    {/* Hero */}
    <div className="px-5 py-10 text-center" style={{ background: `linear-gradient(180deg, ${accent}15, ${bg})` }}>
      <p className="text-xs font-medium mb-2" style={{ color: accent }}>🛠️ خدمات احترافية</p>
      <h1 className="text-xl font-bold mb-2" style={{ color: primary }}>نحوّل أفكارك إلى واقع</h1>
      <p className="text-xs mb-4 opacity-70" style={{ color: primary }}>تصميم، برمجة، تسويق، واستشارات</p>
      <button className="px-6 py-2.5 rounded-full text-sm font-medium" style={{ backgroundColor: accent, color: bg }}>
        احجز استشارة مجانية
      </button>
    </div>

    {/* Services */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>خدماتنا</h2>
      <div className="space-y-3">
        {[
          { name: "تصميم هوية بصرية", desc: "شعار + بطاقات + ألوان", price: "١٥٠,٠٠٠", duration: "٣-٥ أيام" },
          { name: "تطوير موقع إلكتروني", desc: "تصميم وبرمجة متجاوبة", price: "٣٠٠,٠٠٠", duration: "٧-١٤ يوم" },
          { name: "إدارة سوشال ميديا", desc: "محتوى + تصميم + جدولة", price: "٢٠٠,٠٠٠/شهر", duration: "مستمر" },
        ].map((service) => (
          <div key={service.name} className="rounded-xl p-4 flex gap-3" style={{ border: `1px solid ${primary}12`, backgroundColor: `${primary}03` }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}15` }}>
              <Package className="h-5 w-5" style={{ color: accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold mb-0.5" style={{ color: primary }}>{service.name}</h3>
              <p className="text-[10px] opacity-60 mb-2" style={{ color: primary }}>{service.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: accent }}>{service.price} د.ع</span>
                  <span className="text-[9px] flex items-center gap-0.5 opacity-50" style={{ color: primary }}>
                    <Clock className="h-2.5 w-2.5" /> {service.duration}
                  </span>
                </div>
                <button className="px-3 py-1 rounded-full text-[10px] font-medium" style={{ backgroundColor: accent, color: bg }}>احجز</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Packages */}
    <div className="px-4 pb-6">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>الباقات</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "الباقة الأساسية", price: "٩٩,٠٠٠", items: ["تصميم شعار", "بطاقة أعمال", "٢ مراجعات"] },
          { name: "الباقة المتقدمة", price: "٢٤٩,٠٠٠", items: ["هوية كاملة", "موقع بسيط", "٥ مراجعات"], featured: true },
        ].map((pkg) => (
          <div key={pkg.name} className="rounded-xl p-3 text-center relative" style={{
            border: `1px solid ${pkg.featured ? accent : `${primary}12`}`,
            backgroundColor: pkg.featured ? `${accent}08` : `${primary}03`
          }}>
            {pkg.featured && <span className="absolute -top-2 right-3 text-[8px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: accent, color: bg }}>الأفضل</span>}
            <h3 className="text-[11px] font-bold mt-1 mb-1" style={{ color: primary }}>{pkg.name}</h3>
            <p className="text-sm font-bold mb-2" style={{ color: accent }}>{pkg.price} د.ع</p>
            <div className="space-y-1.5 mb-3">
              {pkg.items.map((item) => (
                <div key={item} className="flex items-center gap-1 justify-center">
                  <Check className="h-2.5 w-2.5" style={{ color: accent }} />
                  <span className="text-[9px]" style={{ color: primary }}>{item}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-1.5 rounded-full text-[10px] font-medium" style={{
              backgroundColor: pkg.featured ? accent : 'transparent',
              color: pkg.featured ? bg : accent,
              border: `1px solid ${accent}`
            }}>اختر الباقة</button>
          </div>
        ))}
      </div>
    </div>

    {/* Portfolio */}
    <div className="px-4 pb-6">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>أعمالنا السابقة</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {["مشروع تصميم", "موقع إلكتروني", "حملة تسويقية"].map((work) => (
          <div key={work} className="flex-shrink-0 w-40 rounded-xl overflow-hidden" style={{ border: `1px solid ${primary}12` }}>
            <div className="h-24 flex items-center justify-center" style={{ backgroundColor: `${accent}08` }}>
              <Package className="h-8 w-8 opacity-15" style={{ color: primary }} />
            </div>
            <div className="p-2.5">
              <p className="text-[10px] font-medium" style={{ color: primary }}>{work}</p>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-2 w-2" style={{ color: accent, fill: accent }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="mx-4 mb-6 rounded-xl p-5 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
      <Calendar className="h-6 w-6 mx-auto mb-2" style={{ color: bg }} />
      <p className="text-sm font-bold mb-1" style={{ color: bg }}>احجز موعدك الآن</p>
      <p className="text-[10px] opacity-80 mb-3" style={{ color: bg }}>استشارة مجانية لمدة ٣٠ دقيقة</p>
      <button className="px-5 py-2 rounded-full text-xs font-medium border" style={{ borderColor: `${bg}50`, color: bg }}>
        احجز الآن
      </button>
    </div>

    {/* Footer */}
    <div className="px-4 py-6 text-center" style={{ backgroundColor: `${primary}08`, borderTop: `1px solid ${primary}10` }}>
      <p className="text-sm font-bold mb-2" style={{ color: primary }}>خدماتي</p>
      <div className="flex justify-center gap-4">
        <Phone className="h-4 w-4" style={{ color: accent }} />
        <Mail className="h-4 w-4" style={{ color: accent }} />
        <Share2 className="h-4 w-4" style={{ color: accent }} />
      </div>
    </div>
  </div>
);

export default TemplatePreview;
