import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, Menu, Star, Package, Heart, MapPin, Phone, Mail,
  X, Shield, CreditCard, Instagram, MessageCircle,
  Filter, Minus, Plus, ArrowRight, Clock, Check, Download, Play,
  FileText, BookOpen, Award, User, Zap, Globe, Bell, Quote, Layers
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useStores } from "@/hooks/useStores";
import type { Product } from "@/types/product";

const Storefront = () => {
  const navigate = useNavigate();
  const { products } = useInventory();
  const { activeStore } = useStores();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const toggleLike = (id: string) => setLiked(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(c => c.product.id === productId ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0));
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => {
    const price = c.product.discount ? c.product.price - (c.product.price * c.product.discount / 100) : c.product.price;
    return s + price * c.qty;
  }, 0);

  const getDiscountedPrice = (p: Product) => p.discount ? p.price - (p.price * p.discount / 100) : p.price;

  const storeName = activeStore?.name || "أكاديمية نور";

  // Digital dummy products
  const dummyProducts: Product[] = [
    { id: "d1", name: "دورة تصميم UI/UX الشاملة", description: "من الصفر للاحتراف - تعلم Figma و Adobe XD مع مشاريع عملية تطبيقية. تشمل ٤٥ درس فيديو وملفات المشاريع.", category: "دورات", price: 75000, discount: 35, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d2", name: "دورة البرمجة بلغة Python", description: "تعلم البرمجة من الصفر مع تطبيقات عملية في تحليل البيانات والذكاء الاصطناعي.", category: "دورات", price: 60000, discount: 20, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d3", name: "كتاب التسويق الرقمي الشامل", description: "دليل شامل لاستراتيجيات التسويق الرقمي الحديثة مع أمثلة عملية من السوق العربي. ٢٤٠ صفحة.", category: "كتب", price: 15000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d4", name: "قوالب تصميم سوشال ميديا", description: "٥٠ قالب احترافي قابل للتعديل لمنصات التواصل الاجتماعي بصيغة PSD و Canva.", category: "قوالب", price: 25000, discount: 15, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d5", name: "دورة التصوير الاحترافي", description: "تعلم أساسيات ومهارات التصوير الفوتوغرافي مع تقنيات التعديل باستخدام Lightroom.", category: "دورات", price: 45000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d6", name: "دليل البرمجة للمبتدئين", description: "كتاب تعليمي يشرح أساسيات البرمجة بأسلوب مبسط مع تمارين تطبيقية. ١٨٠ صفحة.", category: "كتب", price: 12000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d7", name: "حزمة أيقونات SVG احترافية", description: "١,٠٠٠ أيقونة بصيغة SVG قابلة للتخصيص مع ألوان متعددة لاستخدامها في مشاريعك.", category: "قوالب", price: 10000, discount: 30, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d8", name: "دورة إدارة المشاريع PMP", description: "استعد لاختبار PMP مع شرح مفصل لجميع المجالات المعرفية وأسئلة تدريبية.", category: "دورات", price: 90000, discount: 25, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
  ];

  const displayProducts = products.length > 1 ? products : [...products, ...dummyProducts];
  const displayCategories = ["الكل", ...Array.from(new Set(displayProducts.map(p => p.category)))];
  const displayFiltered = displayProducts.filter(p => {
    const matchCat = activeCategory === "الكل" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const getProductIcon = (category: string) => {
    switch (category) {
      case "دورات": return Play;
      case "كتب": return BookOpen;
      case "قوالب": return Layers;
      default: return FileText;
    }
  };

  const getFileType = (category: string) => {
    switch (category) {
      case "دورات": return "فيديو";
      case "كتب": return "PDF";
      case "قوالب": return "PSD/SVG";
      default: return "ملف";
    }
  };

  const featuredCourse = dummyProducts[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin bar */}
      <div className="sticky top-0 z-50 bg-foreground text-background px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => { window.close(); navigate("/"); }} className="w-7 h-7 rounded-full bg-background/20 flex items-center justify-center">
            <ArrowRight className="h-3.5 w-3.5 text-background" />
          </button>
          <p className="text-[10px] font-medium text-background/80">أنت تشاهد متجرك كما يراه العملاء</p>
        </div>
        <button onClick={() => { window.close(); navigate("/"); }} className="text-[10px] font-bold text-background/90 bg-background/15 px-3 py-1.5 rounded-full">
          العودة للوحة التحكم
        </button>
      </div>

      {/* Store navbar */}
      <div className="sticky top-[40px] z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Menu className="h-5 w-5 text-foreground" />
          <span className="text-sm font-bold text-foreground">أكاديمية نور</span>
          <div className="flex gap-3 items-center">
            <button onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-5 w-5 text-foreground" />
            </button>
            <button onClick={() => setShowCart(true)} className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
        {showSearch && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted border border-border">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن دورة أو كتاب..."
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none" autoFocus />
              {searchQuery && <button onClick={() => setSearchQuery("")}><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
            </div>
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/12 via-primary/5 to-transparent">
        <div className="px-5 py-12 text-center relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium mb-3 bg-primary/15 text-primary">
            🎓 +٥,٠٠٠ طالب يتعلمون معنا
          </span>
          <h1 className="text-2xl font-bold text-foreground mb-2">طوّر مهاراتك الرقمية</h1>
          <p className="text-xs text-muted-foreground mb-5 max-w-[280px] mx-auto">
            دورات تعليمية، كتب إلكترونية، وأدوات رقمية من أفضل المدربين العرب
          </p>
          <button onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-2.5 rounded-full text-sm font-bold bg-primary text-primary-foreground shadow-lg">
            ابدأ التعلم
          </button>
        </div>
        <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-primary/5" />
        <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full bg-primary/5" />
      </div>

      {/* Stats */}
      <div className="mx-4 mb-4 grid grid-cols-3 gap-2">
        {[
          { value: "١٥٠+", label: "دورة ومنتج" },
          { value: "٥,٠٠٠+", label: "طالب" },
          { value: "٥٠+", label: "مدرب" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-3 text-center bg-primary/5 border border-border">
            <p className="text-base font-bold text-primary">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Featured course */}
      <div className="px-4 mb-4">
        <h2 className="text-sm font-bold text-foreground mb-3">الدورة المميزة ⭐</h2>
        <button onClick={() => setSelectedProduct(featuredCourse)} className="w-full rounded-2xl overflow-hidden border border-border bg-card text-right">
          <div className="h-44 flex items-center justify-center relative bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-bold bg-primary text-primary-foreground">
              الأكثر مبيعاً
            </span>
            <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-medium bg-card/80 text-foreground backdrop-blur-sm">
              ١٢ ساعة • ٤٥ درس
            </span>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-1">{featuredCourse.name}</h3>
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">{featuredCourse.description}</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">أ</div>
              <span className="text-[10px] font-medium text-foreground">أ. عمر الخطيب</span>
              <div className="flex items-center gap-0.5 mr-auto">
                <Star className="h-3 w-3 text-primary" style={{ fill: 'currentColor' }} />
                <span className="text-[10px] font-bold text-primary">4.9</span>
                <span className="text-[9px] text-muted-foreground">(٣٢٠)</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> ٤٥ درس</span>
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> ٣٢٠ طالب</span>
              <span className="flex items-center gap-1"><Award className="h-3 w-3" /> شهادة</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">{getDiscountedPrice(featuredCourse).toLocaleString("ar-IQ")}</span>
                <span className="text-[10px] text-muted-foreground mr-1">د.ع</span>
                {featuredCourse.discount > 0 && <span className="text-[10px] line-through text-muted-foreground mr-1">{featuredCourse.price.toLocaleString("ar-IQ")}</span>}
              </div>
              <span className="px-5 py-2 rounded-full text-xs font-bold bg-primary text-primary-foreground">اشترك الآن</span>
            </div>
          </div>
        </button>
      </div>

      {/* Categories */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayCategories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div id="products-section" className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">جميع المنتجات ({displayFiltered.length})</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {displayFiltered.map((product) => {
            const finalPrice = getDiscountedPrice(product);
            const Icon = getProductIcon(product.category);
            const fileType = getFileType(product.category);
            return (
              <button key={product.id} onClick={() => setSelectedProduct(product)}
                className="rounded-2xl overflow-hidden text-right bg-card border border-border hover:shadow-md transition-shadow">
                <div className="h-28 relative flex flex-col items-center justify-center gap-1.5 bg-muted/30">
                  <Icon className="h-10 w-10 text-muted-foreground/20" />
                  <span className="text-[8px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">{fileType}</span>
                  {product.discount > 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-bold bg-destructive text-destructive-foreground">
                      خصم {product.discount}٪
                    </span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                    className="absolute top-2 left-2 w-7 h-7 rounded-full bg-card/90 flex items-center justify-center shadow-sm">
                    <Heart className={`h-3.5 w-3.5 ${liked.includes(product.id) ? "text-red-500 fill-red-500" : "text-muted-foreground"}`} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold text-foreground mb-1 leading-tight line-clamp-2">{product.name}</p>
                  <p className="text-[8px] text-muted-foreground mb-1.5 line-clamp-1">{product.category}</p>
                  <div className="flex items-center gap-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-2 w-2 text-primary" style={{ fill: s <= 4 ? 'currentColor' : 'none' }} />
                    ))}
                    <span className="text-[7px] text-muted-foreground">(4.0)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-primary">{finalPrice.toLocaleString("ar-IQ")}</span>
                    <span className="text-[8px] text-muted-foreground">د.ع</span>
                    {product.discount > 0 && (
                      <span className="text-[8px] line-through text-muted-foreground">{product.price.toLocaleString("ar-IQ")}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {displayFiltered.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">لا توجد منتجات</p>
          </div>
        )}
      </div>

      {/* Subscription CTA */}
      <div className="mx-4 mb-6 rounded-2xl p-6 text-center bg-gradient-to-br from-primary to-accent">
        <Award className="h-8 w-8 mx-auto mb-2 text-primary-foreground" />
        <p className="text-base font-bold text-primary-foreground mb-1">اشترك بالباقة السنوية</p>
        <p className="text-xs text-primary-foreground/80 mb-4">وصول غير محدود لجميع الدورات والمحتوى</p>
        <span className="inline-block px-6 py-2.5 rounded-full text-sm font-bold bg-background text-primary">
          ٢٤٩,٠٠٠ د.ع / سنة
        </span>
      </div>

      {/* Testimonials */}
      <div className="px-4 pb-6">
        <h2 className="text-sm font-bold text-foreground mb-3">ماذا يقول طلابنا 💬</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { name: "سارة أحمد", text: "دورة رائعة! تعلمت التصميم من الصفر وحصلت على عمل خلال شهرين. شكراً جزيلاً 🙏", rating: 5 },
            { name: "محمد علي", text: "المحتوى ممتاز والشرح واضح جداً. أفضل منصة عربية للتعلم.", rating: 5 },
            { name: "ريم حسين", text: "الكتب الإلكترونية مفيدة جداً وبأسعار ممتازة. أنصح الجميع بشدة!", rating: 4 },
          ].map((t) => (
            <div key={t.name} className="flex-shrink-0 w-64 rounded-xl p-3 bg-card border border-border">
              <Quote className="h-4 w-4 mb-2 text-primary/20" />
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{t.text}</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">{t.name[0]}</div>
                <span className="text-[10px] font-medium text-foreground">{t.name}</span>
                <div className="flex gap-0.5 mr-auto">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-2 w-2 text-primary" style={{ fill: s <= t.rating ? 'currentColor' : 'none' }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mx-4 mb-6 grid grid-cols-3 gap-2">
        {[
          { icon: Download, label: "تحميل فوري", desc: "بعد الشراء مباشرة" },
          { icon: Shield, label: "محتوى محمي", desc: "روابط آمنة" },
          { icon: Award, label: "شهادات", desc: "عند إتمام الدورة" },
        ].map((f) => (
          <div key={f.label} className="rounded-xl p-3 text-center bg-card border border-border">
            <f.icon className="h-5 w-5 mx-auto mb-1.5 text-primary" />
            <p className="text-[10px] font-bold text-foreground">{f.label}</p>
            <p className="text-[8px] text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-8 bg-muted/50 border-t border-border">
        <p className="text-base font-bold text-center text-foreground mb-2">أكاديمية نور</p>
        <p className="text-[10px] text-center text-muted-foreground mb-4">محتوى رقمي عربي متميز لتطوير مهاراتك</p>
        <div className="flex justify-center gap-4 mb-3">
          <Instagram className="h-4 w-4 text-muted-foreground" />
          <Globe className="h-4 w-4 text-muted-foreground" />
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          <Mail className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-center text-[9px] text-muted-foreground">© ٢٠٢٦ أكاديمية نور - جميع الحقوق محفوظة</p>
        <p className="text-center text-[8px] text-muted-foreground mt-1">مدعوم من <span className="font-bold text-primary">Matager</span></p>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSelectedProduct(null)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-foreground" />
            </button>
            <span className="text-xs font-bold text-foreground">تفاصيل المنتج</span>
            <button onClick={() => setShowCart(true)} className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>

          {/* Product hero */}
          <div className="h-56 bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center relative">
            {(() => { const Icon = getProductIcon(selectedProduct.category); return <Icon className="h-16 w-16 text-primary/20" />; })()}
            <span className="mt-2 text-[10px] px-3 py-1 rounded-full font-medium bg-primary/10 text-primary">{getFileType(selectedProduct.category)}</span>
            {selectedProduct.discount > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">
                خصم {selectedProduct.discount}٪
              </span>
            )}
          </div>

          <div className="p-4 space-y-4">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{selectedProduct.category}</span>
              <h2 className="text-lg font-bold text-foreground mt-2 mb-1">{selectedProduct.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3 w-3 text-primary" style={{ fill: s <= 4 ? 'currentColor' : 'none' }} />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground">(4.0) • ١٢٨ تقييم</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{getDiscountedPrice(selectedProduct).toLocaleString("ar-IQ")}</span>
                <span className="text-sm text-muted-foreground">د.ع</span>
                {selectedProduct.discount > 0 && (
                  <span className="text-sm line-through text-muted-foreground">{selectedProduct.price.toLocaleString("ar-IQ")}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-bold text-foreground mb-1.5">الوصف</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
            </div>

            {/* What you get */}
            <div>
              <p className="text-xs font-bold text-foreground mb-2">ماذا ستحصل عليه</p>
              <div className="space-y-2">
                {[
                  { icon: Download, text: "تحميل فوري بعد الشراء" },
                  { icon: Shield, text: "وصول مدى الحياة للمحتوى" },
                  { icon: Award, text: "شهادة إتمام (للدورات)" },
                  { icon: MessageCircle, text: "دعم فني عبر الواتساب" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-[11px] text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            {selectedProduct.category === "دورات" && (
              <div className="rounded-xl p-3 bg-muted/50 border border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">أ</div>
                <div>
                  <p className="text-xs font-bold text-foreground">أ. عمر الخطيب</p>
                  <p className="text-[10px] text-muted-foreground">مصمم ومطور • +١٠ سنوات خبرة</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom action */}
          <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-3">
            <button onClick={() => toggleLike(selectedProduct.id)}
              className="w-12 h-12 rounded-xl border border-border flex items-center justify-center bg-card">
              <Heart className={`h-5 w-5 ${liked.includes(selectedProduct.id) ? "text-red-500 fill-red-500" : "text-muted-foreground"}`} />
            </button>
            <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" /> اشتري الآن
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowCart(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-background shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-foreground">سلة التسوق ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-sm">السلة فارغة</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {cart.map(({ product, qty }) => {
                    const price = getDiscountedPrice(product);
                    const Icon = getProductIcon(product.category);
                    return (
                      <div key={product.id} className="flex gap-3 p-4">
                        <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground line-clamp-1">{product.name}</p>
                          <p className="text-xs font-bold text-primary mt-0.5">{price.toLocaleString("ar-IQ")} د.ع</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateCartQty(product.id, -1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center">
                              <Minus className="h-3 w-3 text-foreground" />
                            </button>
                            <span className="text-xs font-bold text-foreground w-6 text-center">{qty}</span>
                            <button onClick={() => updateCartQty(product.id, 1)} className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-foreground whitespace-nowrap self-center">
                          {(price * qty).toLocaleString("ar-IQ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">المجموع</span>
                  <span className="text-lg font-bold text-foreground">{cartTotal.toLocaleString("ar-IQ")} <span className="text-xs text-muted-foreground">د.ع</span></span>
                </div>
                <button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2">
                  <CreditCard className="h-4 w-4" /> إتمام الشراء
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      <div className="fixed bottom-6 left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30" style={{ backgroundColor: '#25D366' }}>
        <MessageCircle className="h-6 w-6 text-white" />
      </div>
    </div>
  );
};

export default Storefront;
