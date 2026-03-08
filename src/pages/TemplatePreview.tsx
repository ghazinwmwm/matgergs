import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight, Search, ShoppingCart, Menu, Star, Package, Heart, Share2, MapPin, Phone, Mail,
  FileText, Download, Play, Calendar, Clock, User, Palette, Check, X, Truck, Shield, RefreshCw,
  ChevronLeft, Instagram, MessageCircle, Globe, Headphones, BookOpen, Layers, Award, Zap,
  Eye, Filter, Bell, Home, Tag, Percent, Gift, CreditCard, BadgeCheck, Quote, ThumbsUp
} from "lucide-react";
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
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/templates")}>العودة للقوالب</Button>
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
      {/* Sticky action bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/templates")} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-foreground" />
          </button>
          <div>
            <p className="text-xs font-bold text-foreground">معاينة: {template.name}</p>
            <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{template.description}</p>
          </div>
        </div>
        <Button onClick={applyTemplate} size="sm" className="gap-1 text-xs">
          <Palette className="h-3 w-3" /> تطبيق
        </Button>
      </div>

      {/* Preview */}
      <div className="flex-1">
        {template.type === "store" && <StorePreview bg={bg} primary={primary} accent={accentColor} template={template} />}
        {template.type === "digital" && <DigitalPreview bg={bg} primary={primary} accent={accentColor} template={template} />}
        {template.type === "service" && <ServicePreview bg={bg} primary={primary} accent={accentColor} template={template} />}
      </div>
    </div>
  );
};

interface PreviewProps { bg: string; primary: string; accent: string; template: Template; }

/* ─────────────── STORE PREVIEW ─────────────── */
const StorePreview = ({ bg, primary, accent }: PreviewProps) => {
  const [liked, setLiked] = useState<string[]>([]);
  const toggleLike = (name: string) => setLiked(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  const products = [
    { name: "سماعات لاسلكية Pro", price: "٢٥٠,٠٠٠", oldPrice: "٣٥٠,٠٠٠", rating: 4.8, reviews: 128, badge: "خصم ٣٠٪", sold: 340 },
    { name: "حقيبة جلد طبيعي", price: "١٨٠,٠٠٠", oldPrice: "٢٤٠,٠٠٠", rating: 4.5, reviews: 89, badge: "", sold: 210 },
    { name: "ساعة ذكية Ultra", price: "٤٥٠,٠٠٠", oldPrice: "٦٠٠,٠٠٠", rating: 4.9, reviews: 256, badge: "الأكثر مبيعاً", sold: 580 },
    { name: "نظارة شمسية كلاسيك", price: "١٢٠,٠٠٠", oldPrice: "١٥٠,٠٠٠", rating: 4.3, reviews: 45, badge: "", sold: 95 },
    { name: "عطر فاخر 100ml", price: "٣٢٠,٠٠٠", oldPrice: "", rating: 4.7, reviews: 67, badge: "جديد", sold: 150 },
    { name: "حذاء رياضي Nike", price: "٢٨٠,٠٠٠", oldPrice: "٣٥٠,٠٠٠", rating: 4.6, reviews: 134, badge: "خصم ٢٠٪", sold: 420 },
  ];

  const newArrivals = [
    { name: "قميص كتان فاخر", price: "٨٥,٠٠٠" },
    { name: "بنطلون جينز", price: "١١٠,٠٠٠" },
    { name: "جاكيت شتوي", price: "١٩٥,٠٠٠" },
    { name: "كاب رياضي", price: "٣٥,٠٠٠" },
  ];

  const reviews = [
    { name: "أحمد محمد", text: "منتجات رائعة وتوصيل سريع جداً! أنصح الجميع بالتعامل معهم.", rating: 5 },
    { name: "سارة علي", text: "جودة ممتازة وأسعار مناسبة. شكراً لكم 💕", rating: 5 },
    { name: "محمد حسين", text: "تجربة تسوق مميزة، التغليف كان احترافي.", rating: 4 },
  ];

  return (
    <div style={{ backgroundColor: bg, color: primary }}>
      {/* Top announcement bar */}
      <div className="text-center py-1.5 text-[10px] font-medium" style={{ backgroundColor: accent, color: bg }}>
        🎉 توصيل مجاني للطلبات فوق ١٠٠,٠٠٠ د.ع
      </div>

      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-40" style={{ backgroundColor: bg, borderBottom: `1px solid ${primary}12` }}>
        <Menu className="h-5 w-5" style={{ color: primary }} />
        <span className="text-base font-bold" style={{ color: primary }}>MATGER</span>
        <div className="flex gap-3 items-center">
          <Search className="h-5 w-5" style={{ color: primary }} />
          <div className="relative">
            <ShoppingCart className="h-5 w-5" style={{ color: primary }} />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center" style={{ backgroundColor: accent, color: bg }}>٣</span>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}20, ${primary}08)` }}>
        <div className="px-5 py-12 text-center relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium mb-3" style={{ backgroundColor: `${accent}20`, color: accent }}>
            ✨ مجموعة ربيع ٢٠٢٦
          </span>
          <h1 className="text-2xl font-bold mb-2" style={{ color: primary }}>أناقتك تبدأ من هنا</h1>
          <p className="text-xs mb-5 opacity-70 max-w-[250px] mx-auto" style={{ color: primary }}>
            اكتشف تشكيلة واسعة من المنتجات المميزة بأسعار منافسة
          </p>
          <button className="px-7 py-2.5 rounded-full text-sm font-bold shadow-lg" style={{ backgroundColor: accent, color: bg }}>
            تسوق الآن
          </button>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-4 left-4 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: accent }} />
        <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: primary }} />
      </div>

      {/* Search bar */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: `${primary}06`, border: `1px solid ${primary}10` }}>
          <Search className="h-4 w-4 opacity-40" style={{ color: primary }} />
          <span className="text-xs opacity-40" style={{ color: primary }}>ابحث عن منتج...</span>
          <div className="mr-auto">
            <Filter className="h-4 w-4 opacity-40" style={{ color: primary }} />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { name: "الكل", icon: "🛍️" },
            { name: "إلكترونيات", icon: "📱" },
            { name: "ملابس", icon: "👕" },
            { name: "إكسسوارات", icon: "⌚" },
            { name: "أحذية", icon: "👟" },
            { name: "عطور", icon: "🧴" },
          ].map((cat, i) => (
            <div key={cat.name} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg" style={{
                backgroundColor: i === 0 ? accent : `${primary}08`,
                border: i === 0 ? 'none' : `1px solid ${primary}10`
              }}>
                {cat.icon}
              </div>
              <span className="text-[9px] font-medium" style={{ color: i === 0 ? accent : primary }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flash sale */}
      <div className="mx-4 mb-4 rounded-2xl p-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}, ${primary})` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" style={{ color: bg }} />
            <span className="text-sm font-bold" style={{ color: bg }}>عروض سريعة</span>
          </div>
          <div className="flex gap-1.5">
            {["٠٥", "١٢", "٣٨"].map((t, i) => (
              <span key={i} className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${bg}25`, color: bg }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2.5 overflow-x-auto">
          {[
            { name: "إيربودز", price: "٩٩,٠٠٠", old: "١٥٠,٠٠٠" },
            { name: "شاحن سريع", price: "٢٥,٠٠٠", old: "٤٥,٠٠٠" },
            { name: "كفر حماية", price: "١٥,٠٠٠", old: "٣٠,٠٠٠" },
          ].map((item) => (
            <div key={item.name} className="flex-shrink-0 w-24 rounded-xl overflow-hidden" style={{ backgroundColor: `${bg}20` }}>
              <div className="h-16 flex items-center justify-center" style={{ backgroundColor: `${bg}15` }}>
                <Package className="h-6 w-6 opacity-30" style={{ color: bg }} />
              </div>
              <div className="p-1.5 text-center">
                <p className="text-[9px] font-medium" style={{ color: bg }}>{item.name}</p>
                <p className="text-[10px] font-bold" style={{ color: bg }}>{item.price}</p>
                <p className="text-[8px] line-through opacity-50" style={{ color: bg }}>{item.old}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold" style={{ color: primary }}>الأكثر مبيعاً 🔥</h2>
          <span className="text-[11px] font-medium" style={{ color: accent }}>عرض الكل ←</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.name} className="rounded-2xl overflow-hidden" style={{ backgroundColor: `${primary}04`, border: `1px solid ${primary}10` }}>
              <div className="h-36 relative flex items-center justify-center" style={{ backgroundColor: `${accent}06` }}>
                <Package className="h-12 w-12 opacity-10" style={{ color: primary }} />
                <button onClick={() => toggleLike(product.name)} className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: `${bg}95` }}>
                  <Heart className="h-4 w-4" style={{ color: liked.includes(product.name) ? '#ef4444' : primary, fill: liked.includes(product.name) ? '#ef4444' : 'none' }} />
                </button>
                {product.badge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-bold" style={{ backgroundColor: accent, color: bg }}>
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-2.5 w-2.5" style={{ color: accent, fill: s <= Math.floor(product.rating) ? accent : 'none' }} />
                  ))}
                  <span className="text-[8px] opacity-50" style={{ color: primary }}>({product.reviews})</span>
                </div>
                <p className="text-[11px] font-medium mb-1.5 leading-tight" style={{ color: primary }}>{product.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold" style={{ color: accent }}>{product.price}</span>
                  {product.oldPrice && <span className="text-[9px] line-through opacity-35" style={{ color: primary }}>{product.oldPrice}</span>}
                </div>
                <p className="text-[8px] mt-1 opacity-40" style={{ color: primary }}>تم بيع {product.sold}+ قطعة</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo banner */}
      <div className="mx-4 mb-4 rounded-2xl p-5 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
        <Percent className="absolute top-3 left-3 h-8 w-8 opacity-10" style={{ color: bg }} />
        <Gift className="absolute bottom-3 right-3 h-8 w-8 opacity-10" style={{ color: bg }} />
        <p className="text-lg font-bold mb-1" style={{ color: bg }}>خصم ٣٠٪ على أول طلب</p>
        <p className="text-xs mb-3 opacity-80" style={{ color: bg }}>استخدم كود الخصم عند الدفع</p>
        <span className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wider" style={{ backgroundColor: `${bg}20`, color: bg, border: `1px dashed ${bg}50` }}>FIRST30</span>
      </div>

      {/* New arrivals horizontal */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold" style={{ color: primary }}>وصل حديثاً ✨</h2>
          <span className="text-[11px] font-medium" style={{ color: accent }}>عرض الكل ←</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {newArrivals.map((item) => (
            <div key={item.name} className="flex-shrink-0 w-32 rounded-2xl overflow-hidden" style={{ border: `1px solid ${primary}10` }}>
              <div className="h-32 flex items-center justify-center" style={{ backgroundColor: `${accent}06` }}>
                <Package className="h-8 w-8 opacity-10" style={{ color: primary }} />
              </div>
              <div className="p-2.5">
                <p className="text-[10px] font-medium" style={{ color: primary }}>{item.name}</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: accent }}>{item.price} د.ع</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features bar */}
      <div className="mx-4 mb-4 grid grid-cols-3 gap-2">
        {[
          { icon: Truck, label: "توصيل سريع", desc: "خلال ٢٤ ساعة" },
          { icon: Shield, label: "ضمان الجودة", desc: "إرجاع مجاني" },
          { icon: CreditCard, label: "دفع آمن", desc: "طرق متعددة" },
        ].map((f) => (
          <div key={f.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: `${primary}05`, border: `1px solid ${primary}08` }}>
            <f.icon className="h-5 w-5 mx-auto mb-1.5" style={{ color: accent }} />
            <p className="text-[10px] font-bold" style={{ color: primary }}>{f.label}</p>
            <p className="text-[8px] opacity-50" style={{ color: primary }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Customer reviews */}
      <div className="px-4 pb-4">
        <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>آراء العملاء 💬</h2>
        <div className="space-y-2.5">
          {reviews.map((review) => (
            <div key={review.name} className="rounded-xl p-3" style={{ backgroundColor: `${primary}04`, border: `1px solid ${primary}08` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${accent}15`, color: accent }}>
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: primary }}>{review.name}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-2 w-2" style={{ color: accent, fill: s <= review.rating ? accent : 'none' }} />
                    ))}
                  </div>
                </div>
                <BadgeCheck className="h-3.5 w-3.5 mr-auto" style={{ color: accent }} />
              </div>
              <p className="text-[10px] leading-relaxed opacity-70" style={{ color: primary }}>{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram-style gallery */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Instagram className="h-4 w-4" style={{ color: accent }} />
          <h2 className="text-sm font-bold" style={{ color: primary }}>تابعنا</h2>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}${8 + i * 2}` }}>
              <Package className="h-6 w-6 opacity-15" style={{ color: primary }} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-8" style={{ backgroundColor: `${primary}08`, borderTop: `1px solid ${primary}10` }}>
        <p className="text-base font-bold text-center mb-4" style={{ color: primary }}>MATGER</p>
        <div className="flex justify-center gap-6 mb-4">
          {["الرئيسية", "المنتجات", "العروض", "من نحن", "تواصل"].map((link) => (
            <span key={link} className="text-[10px]" style={{ color: primary, opacity: 0.6 }}>{link}</span>
          ))}
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <Phone className="h-4 w-4" style={{ color: accent }} />
          <Mail className="h-4 w-4" style={{ color: accent }} />
          <Instagram className="h-4 w-4" style={{ color: accent }} />
          <MessageCircle className="h-4 w-4" style={{ color: accent }} />
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <MapPin className="h-3 w-3" style={{ color: accent }} />
          <span className="text-[10px] opacity-50" style={{ color: primary }}>بغداد، العراق</span>
        </div>
        <p className="text-center text-[9px] opacity-30 mt-3" style={{ color: primary }}>© ٢٠٢٦ جميع الحقوق محفوظة</p>
      </div>

      {/* Floating WhatsApp */}
      <div className="fixed bottom-20 left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40" style={{ backgroundColor: '#25D366' }}>
        <MessageCircle className="h-6 w-6 text-white" />
      </div>
    </div>
  );
};

/* ─────────────── DIGITAL PREVIEW ─────────────── */
const DigitalPreview = ({ bg, primary, accent }: PreviewProps) => (
  <div style={{ backgroundColor: bg, color: primary }}>
    {/* Navbar */}
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${primary}12` }}>
      <Menu className="h-5 w-5" style={{ color: primary }} />
      <span className="text-base font-bold" style={{ color: primary }}>أكاديمية نور</span>
      <div className="flex gap-3">
        <Search className="h-5 w-5" style={{ color: primary }} />
        <Bell className="h-5 w-5" style={{ color: primary }} />
      </div>
    </div>

    {/* Hero */}
    <div className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${accent}18, ${bg})` }}>
      <div className="px-5 py-12 text-center relative z-10">
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium mb-3" style={{ backgroundColor: `${accent}20`, color: accent }}>
          🎓 +٥٠٠٠ طالب يتعلمون معنا
        </span>
        <h1 className="text-2xl font-bold mb-2" style={{ color: primary }}>طوّر مهاراتك الرقمية</h1>
        <p className="text-xs mb-5 opacity-70 max-w-[260px] mx-auto" style={{ color: primary }}>
          دورات ومحتوى رقمي عربي متميز من أفضل المدربين
        </p>
        <button className="px-7 py-2.5 rounded-full text-sm font-bold shadow-lg" style={{ backgroundColor: accent, color: bg }}>
          ابدأ التعلم مجاناً
        </button>
      </div>
      <div className="absolute top-6 right-6 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: accent }} />
    </div>

    {/* Stats */}
    <div className="mx-4 mb-4 grid grid-cols-3 gap-2">
      {[
        { value: "١٥٠+", label: "دورة" },
        { value: "٥,٠٠٠+", label: "طالب" },
        { value: "٥٠+", label: "مدرب" },
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: `${accent}08`, border: `1px solid ${primary}08` }}>
          <p className="text-base font-bold" style={{ color: accent }}>{stat.value}</p>
          <p className="text-[9px] opacity-60" style={{ color: primary }}>{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Categories */}
    <div className="px-4 pb-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { name: "الكل", icon: Layers },
          { name: "تصميم", icon: Palette },
          { name: "برمجة", icon: Globe },
          { name: "تسويق", icon: Zap },
          { name: "أعمال", icon: Award },
        ].map((cat, i) => (
          <div key={cat.name} className="flex items-center gap-1.5 flex-shrink-0 px-3 py-2 rounded-xl text-[10px] font-medium" style={{
            backgroundColor: i === 0 ? accent : `${primary}06`,
            color: i === 0 ? bg : primary,
            border: i === 0 ? 'none' : `1px solid ${primary}10`
          }}>
            <cat.icon className="h-3.5 w-3.5" />
            {cat.name}
          </div>
        ))}
      </div>
    </div>

    {/* Featured course */}
    <div className="px-4 mb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>الدورة المميزة ⭐</h2>
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${primary}10` }}>
        <div className="h-44 flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${primary}12, ${accent}18)` }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: `${accent}40` }}>
            <Play className="h-8 w-8" style={{ color: bg }} />
          </div>
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-bold" style={{ backgroundColor: accent, color: bg }}>
            الأكثر مبيعاً
          </span>
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-medium" style={{ backgroundColor: `${bg}80`, color: primary }}>
            ١٢ ساعة
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-bold mb-1" style={{ color: primary }}>دورة تصميم UI/UX الشاملة</h3>
          <p className="text-[11px] opacity-60 mb-3" style={{ color: primary }}>من الصفر للاحتراف - تعلم Figma و Adobe XD مع مشاريع عملية</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: `${accent}15`, color: accent }}>أ</div>
            <span className="text-[10px] font-medium" style={{ color: primary }}>أ. عمر الخطيب</span>
            <div className="flex items-center gap-0.5 mr-auto">
              <Star className="h-3 w-3" style={{ color: accent, fill: accent }} />
              <span className="text-[10px] font-bold" style={{ color: accent }}>4.9</span>
              <span className="text-[9px] opacity-40" style={{ color: primary }}>(٣٢٠)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-3 text-[10px] opacity-60" style={{ color: primary }}>
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> ٤٥ درس</span>
            <span className="flex items-center gap-1"><User className="h-3 w-3" /> ٣٢٠ طالب</span>
            <span className="flex items-center gap-1"><Award className="h-3 w-3" /> شهادة</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold" style={{ color: accent }}>٧٥,٠٠٠</span>
              <span className="text-[10px] opacity-40 mr-1" style={{ color: primary }}>د.ع</span>
              <span className="text-[10px] line-through opacity-30 mr-1" style={{ color: primary }}>١٢٠,٠٠٠</span>
            </div>
            <button className="px-5 py-2 rounded-full text-xs font-bold" style={{ backgroundColor: accent, color: bg }}>
              اشترك الآن
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Course grid */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>دورات مقترحة</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "البرمجة بلغة Python", lessons: "٣٠", students: "٨٥٠", price: "٤٥,٠٠٠", instructor: "م. ليث" },
          { name: "التسويق الرقمي", lessons: "٢٥", students: "١,٢٠٠", price: "٦٠,٠٠٠", instructor: "أ. نور" },
          { name: "تصوير احترافي", lessons: "٢٠", students: "٤٣٠", price: "٣٥,٠٠٠", instructor: "أ. زيد" },
          { name: "إدارة المشاريع", lessons: "١٨", students: "٦٧٠", price: "٥٠,٠٠٠", instructor: "د. هند" },
        ].map((course) => (
          <div key={course.name} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${primary}10` }}>
            <div className="h-24 flex items-center justify-center relative" style={{ backgroundColor: `${accent}08` }}>
              <Play className="h-8 w-8 opacity-15" style={{ color: primary }} />
              <span className="absolute bottom-2 left-2 text-[8px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${bg}80`, color: primary }}>
                {course.lessons} درس
              </span>
            </div>
            <div className="p-2.5">
              <p className="text-[10px] font-bold mb-1 leading-tight" style={{ color: primary }}>{course.name}</p>
              <p className="text-[8px] opacity-40 mb-1.5" style={{ color: primary }}>{course.instructor} • {course.students} طالب</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold" style={{ color: accent }}>{course.price} د.ع</span>
                <div className="flex items-center gap-0.5">
                  <Star className="h-2 w-2" style={{ color: accent, fill: accent }} />
                  <span className="text-[8px]" style={{ color: primary }}>4.8</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Digital products */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>كتب ومراجع 📚</h2>
      <div className="space-y-2.5">
        {[
          { name: "كتاب التسويق الرقمي الشامل", type: "PDF", pages: "٢٤٠ صفحة", price: "١٥,٠٠٠", downloads: "١,٢٠٠" },
          { name: "دليل البرمجة للمبتدئين", type: "PDF", pages: "١٨٠ صفحة", price: "١٢,٠٠٠", downloads: "٨٩٠" },
          { name: "قوالب تصميم سوشال ميديا", type: "PSD/AI", pages: "٥٠ قالب", price: "٢٥,٠٠٠", downloads: "٢,١٠٠" },
        ].map((product) => (
          <div key={product.name} className="flex gap-3 rounded-xl p-3" style={{ border: `1px solid ${primary}10`, backgroundColor: `${primary}03` }}>
            <div className="w-16 h-20 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0" style={{ backgroundColor: `${accent}10` }}>
              <BookOpen className="h-6 w-6 opacity-30" style={{ color: accent }} />
              <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${accent}20`, color: accent }}>{product.type}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold mb-0.5" style={{ color: primary }}>{product.name}</p>
              <p className="text-[9px] opacity-40 mb-2" style={{ color: primary }}>{product.pages} • {product.downloads} تحميل</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: accent }}>{product.price} د.ع</span>
                <button className="flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-medium" style={{ backgroundColor: accent, color: bg }}>
                  <Download className="h-3 w-3" /> تحميل
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Testimonials */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>ماذا يقول طلابنا</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          { name: "سارة أحمد", text: "دورة رائعة! تعلمت التصميم من الصفر وحصلت على عمل خلال شهرين.", rating: 5 },
          { name: "محمد علي", text: "المحتوى ممتاز والشرح واضح جداً. أنصح الجميع.", rating: 5 },
        ].map((t) => (
          <div key={t.name} className="flex-shrink-0 w-64 rounded-xl p-3" style={{ backgroundColor: `${primary}04`, border: `1px solid ${primary}08` }}>
            <Quote className="h-4 w-4 mb-2 opacity-20" style={{ color: accent }} />
            <p className="text-[10px] leading-relaxed mb-2 opacity-70" style={{ color: primary }}>{t.text}</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: `${accent}15`, color: accent }}>{t.name[0]}</div>
              <span className="text-[10px] font-medium" style={{ color: primary }}>{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="mx-4 mb-4 rounded-2xl p-6 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
      <Award className="h-8 w-8 mx-auto mb-2" style={{ color: bg }} />
      <p className="text-base font-bold mb-1" style={{ color: bg }}>اشترك بالباقة السنوية</p>
      <p className="text-xs opacity-80 mb-3" style={{ color: bg }}>وصول لجميع الدورات بسعر واحد</p>
      <button className="px-6 py-2.5 rounded-full text-sm font-bold" style={{ backgroundColor: bg, color: accent }}>
        ٢٤٩,٠٠٠ د.ع / سنة
      </button>
    </div>

    {/* Footer */}
    <div className="px-4 py-8 text-center" style={{ backgroundColor: `${primary}06`, borderTop: `1px solid ${primary}08` }}>
      <p className="text-base font-bold mb-2" style={{ color: primary }}>أكاديمية نور</p>
      <p className="text-[10px] opacity-50 mb-4" style={{ color: primary }}>محتوى رقمي عربي متميز لتطوير مهاراتك</p>
      <div className="flex justify-center gap-4 mb-3">
        <Instagram className="h-4 w-4" style={{ color: accent }} />
        <Globe className="h-4 w-4" style={{ color: accent }} />
        <MessageCircle className="h-4 w-4" style={{ color: accent }} />
      </div>
      <p className="text-[9px] opacity-30" style={{ color: primary }}>© ٢٠٢٦ جميع الحقوق محفوظة</p>
    </div>
  </div>
);

/* ─────────────── SERVICE PREVIEW ─────────────── */
const ServicePreview = ({ bg, primary, accent }: PreviewProps) => (
  <div style={{ backgroundColor: bg, color: primary }}>
    {/* Navbar */}
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${primary}12` }}>
      <Menu className="h-5 w-5" style={{ color: primary }} />
      <span className="text-base font-bold" style={{ color: primary }}>وكالة إبداع</span>
      <Phone className="h-5 w-5" style={{ color: accent }} />
    </div>

    {/* Hero */}
    <div className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${accent}15, ${bg})` }}>
      <div className="px-5 py-12 text-center relative z-10">
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium mb-3" style={{ backgroundColor: `${accent}20`, color: accent }}>
          🏆 +٣٠٠ مشروع ناجح
        </span>
        <h1 className="text-2xl font-bold mb-2" style={{ color: primary }}>نحوّل أفكارك لواقع</h1>
        <p className="text-xs mb-5 opacity-70 max-w-[260px] mx-auto" style={{ color: primary }}>
          وكالة متخصصة في التصميم والبرمجة والتسويق الرقمي
        </p>
        <div className="flex gap-2 justify-center">
          <button className="px-6 py-2.5 rounded-full text-sm font-bold shadow-lg" style={{ backgroundColor: accent, color: bg }}>
            احجز استشارة
          </button>
          <button className="px-6 py-2.5 rounded-full text-sm font-medium" style={{ border: `1px solid ${primary}30`, color: primary }}>
            أعمالنا
          </button>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="mx-4 mb-4 grid grid-cols-4 gap-2">
      {[
        { value: "٣٠٠+", label: "مشروع" },
        { value: "١٥٠+", label: "عميل" },
        { value: "٥+", label: "سنوات" },
        { value: "٩٨٪", label: "رضا" },
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: `${accent}08`, border: `1px solid ${primary}06` }}>
          <p className="text-sm font-bold" style={{ color: accent }}>{stat.value}</p>
          <p className="text-[8px] opacity-50" style={{ color: primary }}>{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Services */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>خدماتنا 🛠️</h2>
      <div className="space-y-3">
        {[
          { name: "تصميم هوية بصرية كاملة", desc: "شعار + بطاقات أعمال + ألوان + خطوط + دليل الهوية", price: "١٥٠,٠٠٠", duration: "٣-٥ أيام", icon: Palette },
          { name: "تطوير موقع إلكتروني", desc: "تصميم وبرمجة موقع متجاوب مع لوحة تحكم", price: "٣٠٠,٠٠٠", duration: "٧-١٤ يوم", icon: Globe },
          { name: "إدارة سوشال ميديا", desc: "إنشاء محتوى + تصميم + جدولة + تقارير شهرية", price: "٢٠٠,٠٠٠/شهر", duration: "مستمر", icon: Instagram },
          { name: "تصوير منتجات", desc: "تصوير احترافي للمنتجات مع تعديل وإخراج", price: "١٠٠,٠٠٠", duration: "١-٢ يوم", icon: Eye },
        ].map((service) => (
          <div key={service.name} className="rounded-2xl p-4 flex gap-3" style={{ border: `1px solid ${primary}10`, backgroundColor: `${primary}03` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}12` }}>
              <service.icon className="h-5 w-5" style={{ color: accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[11px] font-bold mb-0.5" style={{ color: primary }}>{service.name}</h3>
              <p className="text-[9px] opacity-50 mb-2 leading-relaxed" style={{ color: primary }}>{service.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: accent }}>{service.price} د.ع</span>
                  <span className="text-[8px] flex items-center gap-0.5 opacity-40" style={{ color: primary }}>
                    <Clock className="h-2.5 w-2.5" /> {service.duration}
                  </span>
                </div>
                <button className="px-3 py-1 rounded-full text-[9px] font-medium" style={{ backgroundColor: accent, color: bg }}>اطلب الآن</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Packages */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>الباقات 📦</h2>
      <div className="space-y-3">
        {[
          { name: "الباقة الأساسية", price: "٩٩,٠٠٠", items: ["تصميم شعار", "بطاقة أعمال", "غلاف سوشال", "٢ مراجعات"], popular: false },
          { name: "باقة الأعمال", price: "٢٤٩,٠٠٠", items: ["هوية بصرية كاملة", "موقع بسيط", "إدارة سوشال شهر", "٥ مراجعات", "دعم فني"], popular: true },
          { name: "الباقة المتقدمة", price: "٤٩٩,٠٠٠", items: ["كل ميزات باقة الأعمال", "تطبيق موبايل", "حملة إعلانية", "تقارير شهرية", "أولوية الدعم"], popular: false },
        ].map((pkg) => (
          <div key={pkg.name} className="rounded-2xl p-4 relative" style={{
            border: `${pkg.popular ? '2' : '1'}px solid ${pkg.popular ? accent : `${primary}10`}`,
            backgroundColor: pkg.popular ? `${accent}06` : `${primary}02`
          }}>
            {pkg.popular && (
              <span className="absolute -top-2.5 right-4 text-[8px] px-3 py-0.5 rounded-full font-bold" style={{ backgroundColor: accent, color: bg }}>
                ⭐ الأكثر طلباً
              </span>
            )}
            <div className="flex items-center justify-between mb-3 mt-1">
              <h3 className="text-xs font-bold" style={{ color: primary }}>{pkg.name}</h3>
              <div>
                <span className="text-base font-bold" style={{ color: accent }}>{pkg.price}</span>
                <span className="text-[9px] opacity-40" style={{ color: primary }}> د.ع</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 mb-3">
              {pkg.items.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 flex-shrink-0" style={{ color: accent }} />
                  <span className="text-[9px]" style={{ color: primary }}>{item}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2 rounded-xl text-[11px] font-bold" style={{
              backgroundColor: pkg.popular ? accent : 'transparent',
              color: pkg.popular ? bg : accent,
              border: `1px solid ${accent}`
            }}>اختر هذه الباقة</button>
          </div>
        ))}
      </div>
    </div>

    {/* Portfolio */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>أعمالنا السابقة 🎨</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { name: "هوية متجر أزياء", client: "متجر نور", category: "هوية بصرية" },
          { name: "موقع مطعم", client: "مطعم الشام", category: "تطوير ويب" },
          { name: "حملة إعلانية", client: "كافيه بلند", category: "تسويق" },
          { name: "تطبيق توصيل", client: "واصل", category: "تطوير تطبيقات" },
        ].map((work) => (
          <div key={work.name} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${primary}10` }}>
            <div className="h-28 flex items-center justify-center" style={{ backgroundColor: `${accent}08` }}>
              <Package className="h-8 w-8 opacity-10" style={{ color: primary }} />
            </div>
            <div className="p-2.5">
              <p className="text-[10px] font-bold" style={{ color: primary }}>{work.name}</p>
              <p className="text-[8px] opacity-40" style={{ color: primary }}>{work.client}</p>
              <span className="inline-block mt-1 text-[7px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accent}12`, color: accent }}>{work.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Testimonials */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>آراء عملائنا 💬</h2>
      <div className="space-y-2.5">
        {[
          { name: "عمر الكاظمي", role: "صاحب متجر", text: "فريق محترف جداً! سلموا المشروع قبل الموعد والنتيجة فاقت التوقعات." },
          { name: "ريم السعدي", role: "مديرة تسويق", text: "أفضل وكالة تعاملت معها. الإبداع والالتزام بالمواعيد شيء مميز." },
        ].map((t) => (
          <div key={t.name} className="rounded-xl p-3" style={{ backgroundColor: `${primary}04`, border: `1px solid ${primary}08` }}>
            <Quote className="h-4 w-4 mb-2 opacity-15" style={{ color: accent }} />
            <p className="text-[10px] leading-relaxed mb-2 opacity-70" style={{ color: primary }}>{t.text}</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: `${accent}15`, color: accent }}>{t.name[0]}</div>
              <div>
                <p className="text-[10px] font-bold" style={{ color: primary }}>{t.name}</p>
                <p className="text-[8px] opacity-40" style={{ color: primary }}>{t.role}</p>
              </div>
              <div className="flex gap-0.5 mr-auto">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-2 w-2" style={{ color: accent, fill: accent }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Process */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>كيف نعمل؟</h2>
      <div className="space-y-3">
        {[
          { step: "١", title: "استشارة مجانية", desc: "نفهم احتياجاتك وأهدافك" },
          { step: "٢", title: "تخطيط وتصميم", desc: "نقدم خطة عمل ومسودات أولية" },
          { step: "٣", title: "تنفيذ وتطوير", desc: "نبدأ العمل مع تحديثات مستمرة" },
          { step: "٤", title: "تسليم ودعم", desc: "نسلم المشروع مع دعم فني" },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: `${accent}12`, color: accent }}>
              {item.step}
            </div>
            <div>
              <p className="text-[11px] font-bold" style={{ color: primary }}>{item.title}</p>
              <p className="text-[9px] opacity-50" style={{ color: primary }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="mx-4 mb-4 rounded-2xl p-6 text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
      <Calendar className="h-7 w-7 mx-auto mb-2" style={{ color: bg }} />
      <p className="text-base font-bold mb-1" style={{ color: bg }}>احجز استشارتك المجانية</p>
      <p className="text-[10px] opacity-80 mb-4" style={{ color: bg }}>٣٠ دقيقة مع أحد خبرائنا لمناقشة مشروعك</p>
      <button className="px-6 py-2.5 rounded-full text-sm font-bold" style={{ backgroundColor: bg, color: accent }}>
        احجز الآن
      </button>
    </div>

    {/* Contact */}
    <div className="px-4 pb-4">
      <h2 className="text-sm font-bold mb-3" style={{ color: primary }}>تواصل معنا</h2>
      <div className="space-y-2">
        {[
          { icon: Phone, label: "٠٧٧٠١٢٣٤٥٦٧", desc: "اتصل بنا" },
          { icon: Mail, label: "info@ibdaa.com", desc: "راسلنا" },
          { icon: MapPin, label: "بغداد، المنصور", desc: "زرنا" },
        ].map((c) => (
          <div key={c.label} className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: `${primary}04`, border: `1px solid ${primary}08` }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}12` }}>
              <c.icon className="h-4 w-4" style={{ color: accent }} />
            </div>
            <div>
              <p className="text-[10px] font-bold" style={{ color: primary }}>{c.label}</p>
              <p className="text-[8px] opacity-40" style={{ color: primary }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="px-4 py-8 text-center" style={{ backgroundColor: `${primary}06`, borderTop: `1px solid ${primary}08` }}>
      <p className="text-base font-bold mb-2" style={{ color: primary }}>وكالة إبداع</p>
      <p className="text-[10px] opacity-50 mb-4" style={{ color: primary }}>نصنع التميز لأعمالك</p>
      <div className="flex justify-center gap-4 mb-3">
        <Instagram className="h-4 w-4" style={{ color: accent }} />
        <Globe className="h-4 w-4" style={{ color: accent }} />
        <MessageCircle className="h-4 w-4" style={{ color: accent }} />
        <Mail className="h-4 w-4" style={{ color: accent }} />
      </div>
      <p className="text-[9px] opacity-30" style={{ color: primary }}>© ٢٠٢٦ جميع الحقوق محفوظة</p>
    </div>

    {/* Floating WhatsApp */}
    <div className="fixed bottom-20 left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40" style={{ backgroundColor: '#25D366' }}>
      <MessageCircle className="h-6 w-6 text-white" />
    </div>
  </div>
);

export default TemplatePreview;
