import { useState, useRef } from "react";
import {
  Search, ShoppingCart, Star, Heart, X, Shield, CreditCard,
  Instagram, MessageCircle, Minus, Plus, ArrowRight, Download, Play,
  FileText, BookOpen, Award, User, Globe, Quote, Layers,
  Check, ChevronLeft, Phone, Sparkles, ArrowDown, Mail,
  Palette, Code, Camera, PenTool, Monitor, Briefcase,
  ChevronRight, ExternalLink, Menu, Zap
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useStores } from "@/hooks/useStores";
import type { Product } from "@/types/product";

type CheckoutStep = "cart" | "info" | "confirm" | "success";
type Section = "home" | "works" | "store" | "about";

const Storefront = () => {
  const { products } = useInventory();
  const { activeStore } = useStores();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Checkout
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "", notes: "" });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "electronic">("electronic");

  const toggleLike = (id: string) => setLiked(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { product, qty: 1 }];
    });
  };

  const buyNow = (product: Product) => {
    setCart([{ product, qty: 1 }]);
    setCheckoutStep("info");
    setShowCart(true);
    setSelectedProduct(null);
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

  const storeName = activeStore?.name || "استوديو إبداع";

  const dummyProducts: Product[] = [
    { id: "d1", name: "دورة تصميم UI/UX الشاملة", description: "من الصفر للاحتراف - تعلم Figma و Adobe XD مع ٤٥ درس فيديو ومشاريع عملية تطبيقية وملفات المصادر.", category: "دورات", price: 75000, discount: 35, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d2", name: "دورة البرمجة بلغة Python", description: "تعلم البرمجة من الصفر مع تطبيقات عملية في تحليل البيانات والذكاء الاصطناعي. ٦٠ درس.", category: "دورات", price: 60000, discount: 20, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d3", name: "كتاب التسويق الرقمي الشامل", description: "دليل شامل لاستراتيجيات التسويق الرقمي الحديثة مع أمثلة عملية. ٢٤٠ صفحة.", category: "كتب", price: 15000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d4", name: "قوالب تصميم سوشال ميديا", description: "٥٠ قالب احترافي قابل للتعديل لمنصات التواصل الاجتماعي بصيغة PSD و Canva.", category: "قوالب", price: 25000, discount: 15, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d5", name: "دورة التصوير الاحترافي", description: "تعلم أساسيات التصوير الفوتوغرافي مع تقنيات التعديل باستخدام Lightroom و Photoshop.", category: "دورات", price: 45000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d6", name: "حزمة أيقونات SVG احترافية", description: "١,٠٠٠ أيقونة بصيغة SVG قابلة للتخصيص بالكامل لمشاريعك.", category: "قوالب", price: 10000, discount: 30, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d7", name: "دورة إدارة المشاريع", description: "استعد لاختبار PMP مع شرح مفصل وأسئلة تدريبية وشهادة إتمام.", category: "دورات", price: 90000, discount: 25, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d8", name: "كتاب البرمجة للمبتدئين", description: "كتاب تعليمي يشرح أساسيات البرمجة بأسلوب مبسط وتمارين عملية. ١٨٠ صفحة.", category: "كتب", price: 12000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
  ];

  const displayProducts = products.length > 1 ? products : [...products, ...dummyProducts];
  const displayCategories = ["الكل", ...Array.from(new Set(displayProducts.map(p => p.category)))];
  const displayFiltered = displayProducts.filter(p => {
    const matchCat = activeCategory === "الكل" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const getProductIcon = (cat: string) => {
    switch (cat) { case "دورات": return Play; case "كتب": return BookOpen; case "قوالب": return Layers; default: return FileText; }
  };
  const getFileType = (cat: string) => {
    switch (cat) { case "دورات": return "فيديو"; case "كتب": return "PDF"; case "قوالب": return "PSD/SVG"; default: return "ملف"; }
  };

  const openCartDrawer = () => { setCheckoutStep("cart"); setShowCart(true); };
  const handlePlaceOrder = () => {
    setCheckoutStep("success");
    setTimeout(() => { setCart([]); setCheckoutStep("cart"); setShowCart(false); setCustomerInfo({ name: "", phone: "", email: "", notes: "" }); }, 4000);
  };
  const isInfoValid = customerInfo.name.trim().length >= 2 && customerInfo.phone.trim().length >= 10;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setShowMobileMenu(false);
  };

  // Portfolio works
  const works = [
    { title: "هوية بصرية لمطعم فاخر", category: "هوية بصرية", gradient: "from-[hsl(var(--primary)/0.3)] to-[hsl(var(--accent)/0.2)]" },
    { title: "تطبيق موبايل للتوصيل", category: "تصميم واجهات", gradient: "from-[hsl(var(--accent)/0.3)] to-[hsl(var(--primary)/0.15)]" },
    { title: "موقع إلكتروني لشركة عقارات", category: "تطوير ويب", gradient: "from-[hsl(var(--success)/0.2)] to-[hsl(var(--primary)/0.15)]" },
    { title: "حملة تسويقية لمنتج تقني", category: "تسويق رقمي", gradient: "from-[hsl(var(--destructive)/0.15)] to-[hsl(var(--primary)/0.1)]" },
    { title: "نظام إدارة محتوى", category: "تطوير ويب", gradient: "from-[hsl(var(--primary)/0.2)] to-[hsl(var(--success)/0.15)]" },
    { title: "تصميم تطبيق صحي", category: "تصميم واجهات", gradient: "from-[hsl(var(--accent)/0.2)] to-[hsl(var(--success)/0.15)]" },
  ];

  const services = [
    { icon: Palette, title: "تصميم جرافيك", desc: "هويات بصرية، شعارات، ومطبوعات احترافية" },
    { icon: Monitor, title: "تصميم واجهات", desc: "تصميم UI/UX لتطبيقات الموبايل والويب" },
    { icon: Code, title: "تطوير ويب", desc: "مواقع ومتاجر إلكترونية بأحدث التقنيات" },
    { icon: Camera, title: "تصوير احترافي", desc: "تصوير منتجات وفعاليات ومحتوى رقمي" },
  ];

  const testimonials = [
    { name: "سارة أحمد", role: "مديرة تسويق", text: "تجربة رائعة! الدورة غيّرت مساري المهني بالكامل. المحتوى عملي ومفيد جداً.", rating: 5 },
    { name: "محمد علي", role: "مطور مستقل", text: "أفضل محتوى عربي صادفته. الشرح واضح والدعم ممتاز. أنصح بشدة.", rating: 5 },
    { name: "نور حسين", role: "مصممة", text: "القوالب وفرت عليّ ساعات من العمل. جودة عالية وتصاميم عصرية.", rating: 5 },
    { name: "عمر كريم", role: "رائد أعمال", text: "استثمار ممتاز! عائد الاستثمار كان واضح من أول شهر.", rating: 4 },
  ];

  const navItems = [
    { id: "hero-section", label: "الرئيسية", section: "home" as Section },
    { id: "services-section", label: "الخدمات", section: "home" as Section },
    { id: "works-section", label: "الأعمال", section: "works" as Section },
    { id: "store-section", label: "المتجر", section: "store" as Section },
    { id: "about-section", label: "من نحن", section: "about" as Section },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-foreground">{storeName}</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-6">
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={openCartDrawer} className="relative w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <ShoppingCart className="h-4 w-4 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center animate-in zoom-in">{cartCount}</span>
                )}
              </button>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="sm:hidden w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
                {showMobileMenu ? <X className="h-4 w-4 text-foreground" /> : <Menu className="h-4 w-4 text-foreground" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="sm:hidden border-t border-border bg-card/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)}
                  className="w-full text-right px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section id="hero-section" className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-accent/[0.04] blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-2xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-semibold text-primary">منتجات رقمية • دورات • خدمات احترافية</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground leading-tight mb-4 tracking-tight">
              نصنع تجارب رقمية
              <br />
              <span className="text-primary">تُلهم وتُحقق النتائج</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              دورات تعليمية، أدوات تصميم، وخدمات إبداعية من فريق متخصص. كل ما تحتاجه لبناء حضورك الرقمي.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => scrollTo("store-section")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]">
                تصفح المتجر
              </button>
              <button onClick={() => scrollTo("works-section")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-card border border-border text-foreground hover:bg-muted transition-colors">
                شاهد أعمالنا
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-8 mt-12">
              {[
                { value: "٥,٠٠٠+", label: "عميل سعيد" },
                { value: "١٥٠+", label: "منتج رقمي" },
                { value: "٤.٩", label: "تقييم" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-xl sm:text-2xl font-extrabold text-foreground">{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <ArrowDown className="h-4 w-4 text-muted-foreground animate-bounce" />
        </div>
      </section>

      {/* ══════════════ SERVICES ══════════════ */}
      <section id="services-section" className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">خدماتنا</span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-4">ماذا نقدم لك؟</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto">حلول رقمية شاملة تغطي جميع احتياجاتك من التصميم والتطوير إلى التسويق</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {services.map((s) => (
              <div key={s.title} className="bg-card border border-border rounded-2xl p-4 sm:p-5 text-center hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PORTFOLIO / WORKS ══════════════ */}
      <section id="works-section" className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">معرض الأعمال</span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-4">أعمال نفتخر بها</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">نماذج من مشاريعنا الناجحة مع عملائنا</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {works.map((work, i) => (
              <div key={i} className="group cursor-pointer">
                <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${work.gradient} flex items-center justify-center relative overflow-hidden border border-border`}>
                  <PenTool className="h-8 w-8 text-muted-foreground/20" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center">
                      <ExternalLink className="h-5 w-5 text-background mx-auto mb-1.5" />
                      <p className="text-[10px] font-bold text-background">عرض المشروع</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 px-1">
                  <h3 className="text-xs font-bold text-foreground">{work.title}</h3>
                  <p className="text-[10px] text-muted-foreground">{work.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ STORE / PRODUCTS ══════════════ */}
      <section id="store-section" className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">المتجر الرقمي</span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-4">منتجات رقمية مميزة</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">دورات، كتب، قوالب وأدوات تساعدك على التطور</p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-card border border-border">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن دورة، كتاب، أو قالب..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
              {searchQuery && <button onClick={() => setSearchQuery("")}><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 justify-center">
            {displayCategories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Featured product */}
          {displayProducts.length > 0 && (
            <div className="mb-8">
              <button onClick={() => setSelectedProduct(displayProducts[0])}
                className="w-full sm:max-w-2xl sm:mx-auto block rounded-2xl overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow text-right">
                <div className="sm:flex">
                  <div className="h-44 sm:h-auto sm:w-64 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 relative">
                    <Play className="h-12 w-12 text-primary/20" />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">⭐ الأكثر مبيعاً</span>
                  </div>
                  <div className="p-5 flex-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{displayProducts[0].category}</span>
                    <h3 className="text-base font-bold text-foreground mt-2 mb-1">{displayProducts[0].name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{displayProducts[0].description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary">{getDiscountedPrice(displayProducts[0]).toLocaleString("ar-IQ")}</span>
                        <span className="text-xs text-muted-foreground mr-1">د.ع</span>
                        {displayProducts[0].discount > 0 && <span className="text-xs line-through text-muted-foreground mr-2">{displayProducts[0].price.toLocaleString("ar-IQ")}</span>}
                      </div>
                      <span onClick={(e) => { e.stopPropagation(); buyNow(displayProducts[0]); }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground active:scale-95 transition-transform cursor-pointer">
                        اشتري الآن
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Products grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {displayFiltered.slice(1).map((product) => {
              const finalPrice = getDiscountedPrice(product);
              const Icon = getProductIcon(product.category);
              return (
                <div key={product.id} className="rounded-2xl overflow-hidden bg-card border border-border hover:shadow-md transition-all group">
                  <button onClick={() => setSelectedProduct(product)} className="w-full text-right">
                    <div className="h-32 sm:h-36 relative flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-muted/50 to-muted/20">
                      <Icon className="h-8 w-8 text-muted-foreground/15 group-hover:scale-110 transition-transform" />
                      <span className="text-[8px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">{getFileType(product.category)}</span>
                      {product.discount > 0 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-bold bg-destructive text-destructive-foreground">
                          خصم {product.discount}٪
                        </span>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                        className="absolute top-2 left-2 w-7 h-7 rounded-full bg-card/90 flex items-center justify-center shadow-sm">
                        <Heart className={`h-3.5 w-3.5 ${liked.includes(product.id) ? "text-destructive fill-current" : "text-muted-foreground"}`} />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-bold text-foreground mb-1 leading-tight line-clamp-2">{product.name}</p>
                      <div className="flex items-center gap-1 mb-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-2.5 w-2.5 text-primary" style={{ fill: s <= 4 ? 'currentColor' : 'none' }} />
                        ))}
                        <span className="text-[8px] text-muted-foreground">(4.0)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-primary">{finalPrice.toLocaleString("ar-IQ")}</span>
                        <span className="text-[8px] text-muted-foreground">د.ع</span>
                      </div>
                    </div>
                  </button>
                  <div className="px-3 pb-3">
                    <button onClick={() => buyNow(product)}
                      className="w-full py-2.5 rounded-xl text-[11px] font-bold bg-primary text-primary-foreground flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                      <Sparkles className="h-3 w-3" /> شراء سريع
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">آراء العملاء</span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-4">ماذا يقولون عنا؟</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-colors">
                <Quote className="h-5 w-5 text-primary/15 mb-3" />
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.name[0]}</div>
                  <div>
                    <p className="text-[11px] font-bold text-foreground">{t.name}</p>
                    <p className="text-[9px] text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="flex gap-0.5 mr-auto">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="h-2.5 w-2.5 text-primary" style={{ fill: s <= t.rating ? 'currentColor' : 'none' }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-16 sm:py-20 bg-primary/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">مستعد للبدء؟</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">انضم لآلاف العملاء الذين يثقون بنا. تصفح متجرنا أو تواصل معنا مباشرة.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => scrollTo("store-section")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                تصفح المنتجات
              </button>
              <a href="https://wa.me/" target="_blank" rel="noopener"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-card border border-border text-foreground flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4" /> تواصل واتساب
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
      <section id="about-section" className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="sm:flex items-start gap-10">
            <div className="flex-1 mb-8 sm:mb-0">
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">من نحن</span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-4 mb-3">فريق شغوف بالإبداع الرقمي</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                نحن فريق من المبدعين والمطورين نؤمن بأن كل شخص يستحق الوصول لمحتوى رقمي عربي عالي الجودة. 
                نعمل على تقديم دورات تعليمية، أدوات تصميم، وخدمات احترافية تساعدك على تحقيق أهدافك.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Award, label: "+٥ سنوات خبرة" },
                  { icon: Download, label: "تسليم فوري" },
                  { icon: Shield, label: "ضمان الجودة" },
                ].map(f => (
                  <div key={f.label} className="rounded-xl bg-card border border-border p-3 text-center">
                    <f.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                    <p className="text-[9px] sm:text-[10px] font-bold text-foreground">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">تواصل معنا</h3>
                <div className="space-y-3">
                  {[
                    { icon: Mail, text: "hello@studio.com", dir: "ltr" as const },
                    { icon: Phone, text: "+964 770 123 4567", dir: "ltr" as const },
                    { icon: Instagram, text: "@studio_iq" },
                    { icon: Globe, text: "www.studio.com", dir: "ltr" as const },
                  ].map(c => (
                    <div key={c.text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <c.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground" dir={c.dir}>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-xs font-bold text-foreground">{storeName}</span>
            </div>
            <div className="flex items-center gap-4">
              <Instagram className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Globe className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <MessageCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </div>
            <p className="text-[10px] text-muted-foreground">
              مدعوم من <span className="font-bold text-primary">Matager</span> • © ٢٠٢٦
            </p>
          </div>
        </div>
      </footer>

      {/* ══════════════ PRODUCT DETAIL MODAL ══════════════ */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSelectedProduct(null)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-foreground" />
            </button>
            <span className="text-xs font-bold text-foreground">تفاصيل المنتج</span>
            <button onClick={() => { setSelectedProduct(null); openCartDrawer(); }} className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>

          <div className="h-52 bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center relative">
            {(() => { const Icon = getProductIcon(selectedProduct.category); return <Icon className="h-14 w-14 text-primary/20" />; })()}
            <span className="mt-2 text-[10px] px-3 py-1 rounded-full font-medium bg-primary/10 text-primary">{getFileType(selectedProduct.category)}</span>
            {selectedProduct.discount > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">خصم {selectedProduct.discount}٪</span>
            )}
          </div>

          <div className="max-w-2xl mx-auto p-5 space-y-5">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{selectedProduct.category}</span>
              <h2 className="text-lg font-bold text-foreground mt-2 mb-1">{selectedProduct.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3 w-3 text-primary" style={{ fill: s <= 4 ? 'currentColor' : 'none' }} />)}
                </div>
                <span className="text-[11px] text-muted-foreground">(4.0) • ١٢٨ تقييم</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{getDiscountedPrice(selectedProduct).toLocaleString("ar-IQ")}</span>
                <span className="text-sm text-muted-foreground">د.ع</span>
                {selectedProduct.discount > 0 && <span className="text-sm line-through text-muted-foreground">{selectedProduct.price.toLocaleString("ar-IQ")}</span>}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground mb-1">الوصف</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground mb-2">ماذا ستحصل عليه</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Download, text: "تحميل فوري" },
                  { icon: Shield, text: "وصول مدى الحياة" },
                  { icon: Award, text: "شهادة إتمام" },
                  { icon: MessageCircle, text: "دعم فني" },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 bg-muted/50 rounded-xl p-2.5">
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[11px] text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2 max-w-2xl mx-auto">
            <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
              className="h-12 px-5 rounded-xl border border-border bg-card text-foreground font-bold text-xs flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" /> أضف للسلة
            </button>
            <button onClick={() => buyNow(selectedProduct)}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              <Sparkles className="h-4 w-4" /> اشتري الآن
            </button>
          </div>
        </div>
      )}

      {/* ══════════════ CHECKOUT DRAWER ══════════════ */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => { setShowCart(false); setCheckoutStep("cart"); }} />
          <div className="absolute inset-y-0 left-0 w-full sm:max-w-md sm:right-0 sm:left-auto bg-background shadow-xl flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-left duration-300">

            {/* Header */}
            <div className="border-b border-border">
              <div className="flex items-center justify-between px-4 py-3">
                <button onClick={() => {
                  if (checkoutStep === "info") setCheckoutStep("cart");
                  else if (checkoutStep === "confirm") setCheckoutStep("info");
                  else { setShowCart(false); setCheckoutStep("cart"); }
                }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  {checkoutStep === "cart" ? <X className="h-4 w-4 text-foreground" /> : <ArrowRight className="h-4 w-4 text-foreground" />}
                </button>
                <h2 className="text-sm font-bold text-foreground">
                  {checkoutStep === "cart" && `السلة (${cartCount})`}
                  {checkoutStep === "info" && "معلومات الطلب"}
                  {checkoutStep === "confirm" && "تأكيد الطلب"}
                  {checkoutStep === "success" && "تم الطلب ✓"}
                </h2>
                <div className="w-8" />
              </div>
              {checkoutStep !== "success" && (
                <div className="flex gap-1 px-4 pb-3">
                  {["cart", "info", "confirm"].map((step, i) => (
                    <div key={step} className={`h-1 flex-1 rounded-full transition-colors ${
                      ["cart", "info", "confirm"].indexOf(checkoutStep) >= i ? "bg-primary" : "bg-border"
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Cart */}
              {checkoutStep === "cart" && (
                cart.length === 0 ? (
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
                          <button onClick={() => updateCartQty(product.id, -qty)} className="self-start mt-1">
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* Info */}
              {checkoutStep === "info" && (
                <div className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-foreground mb-1 block">الاسم الكامل *</label>
                      <input value={customerInfo.name} onChange={(e) => setCustomerInfo(p => ({ ...p, name: e.target.value }))}
                        className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                        placeholder="أحمد محمد" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-foreground mb-1 block">رقم الهاتف *</label>
                      <input value={customerInfo.phone} onChange={(e) => setCustomerInfo(p => ({ ...p, phone: e.target.value }))}
                        className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                        placeholder="07701234567" type="tel" dir="ltr" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-foreground mb-1 block">البريد الإلكتروني <span className="text-muted-foreground">(لإرسال الرابط)</span></label>
                      <input value={customerInfo.email} onChange={(e) => setCustomerInfo(p => ({ ...p, email: e.target.value }))}
                        className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                        placeholder="ahmed@email.com" type="email" dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-foreground mb-2 block">طريقة الدفع</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setPaymentMethod("electronic")}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${paymentMethod === "electronic" ? "border-primary bg-primary/5" : "border-border"}`}>
                        <CreditCard className={`h-5 w-5 mx-auto mb-1 ${paymentMethod === "electronic" ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="text-[10px] font-bold text-foreground">دفع إلكتروني</p>
                      </button>
                      <button onClick={() => setPaymentMethod("cod")}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                        <Download className={`h-5 w-5 mx-auto mb-1 ${paymentMethod === "cod" ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="text-[10px] font-bold text-foreground">تحويل</p>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-foreground mb-1 block">ملاحظات <span className="text-muted-foreground">(اختياري)</span></label>
                    <textarea value={customerInfo.notes} onChange={(e) => setCustomerInfo(p => ({ ...p, notes: e.target.value }))}
                      className="w-full h-20 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                      placeholder="أي ملاحظات..." />
                  </div>
                </div>
              )}

              {/* Confirm */}
              {checkoutStep === "confirm" && (
                <div className="p-4 space-y-4">
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <h3 className="text-xs font-bold text-foreground">ملخص الطلب</h3>
                    {cart.map(({ product, qty }) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">×{qty}</span>
                          <span className="text-[11px] text-foreground line-clamp-1">{product.name}</span>
                        </div>
                        <span className="text-[11px] font-bold text-foreground">{(getDiscountedPrice(product) * qty).toLocaleString("ar-IQ")}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">المجموع</span>
                      <span className="text-base font-bold text-primary">{cartTotal.toLocaleString("ar-IQ")} <span className="text-[10px] text-muted-foreground">د.ع</span></span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <h3 className="text-xs font-bold text-foreground">معلومات العميل</h3>
                    <div className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-[11px] text-foreground">{customerInfo.name}</span></div>
                    <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-[11px] text-foreground" dir="ltr">{customerInfo.phone}</span></div>
                    {customerInfo.email && <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-[11px] text-foreground" dir="ltr">{customerInfo.email}</span></div>}
                    <div className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-[11px] text-foreground">{paymentMethod === "electronic" ? "دفع إلكتروني" : "تحويل"}</span></div>
                  </div>
                </div>
              )}

              {/* Success */}
              {checkoutStep === "success" && (
                <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-in zoom-in">
                    <Check className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">تم تأكيد طلبك! 🎉</h2>
                  <p className="text-sm text-muted-foreground mb-1">رقم الطلب: #{Math.floor(1000 + Math.random() * 9000)}</p>
                  <p className="text-xs text-muted-foreground mb-6">سيتم إرسال رابط التحميل إلى بريدك الإلكتروني وواتساب</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Download className="h-3.5 w-3.5" /> تحميل فوري
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <MessageCircle className="h-3.5 w-3.5" /> واتساب
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom action */}
            {checkoutStep !== "success" && cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                {checkoutStep !== "confirm" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">المجموع</span>
                    <span className="text-lg font-bold text-foreground">{cartTotal.toLocaleString("ar-IQ")} <span className="text-xs text-muted-foreground">د.ع</span></span>
                  </div>
                )}
                <button
                  disabled={checkoutStep === "info" && !isInfoValid}
                  onClick={() => {
                    if (checkoutStep === "cart") setCheckoutStep("info");
                    else if (checkoutStep === "info") setCheckoutStep("confirm");
                    else if (checkoutStep === "confirm") handlePlaceOrder();
                  }}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform">
                  {checkoutStep === "cart" && <><ChevronLeft className="h-4 w-4" /> متابعة الطلب</>}
                  {checkoutStep === "info" && <><ChevronLeft className="h-4 w-4" /> مراجعة وتأكيد</>}
                  {checkoutStep === "confirm" && <><Check className="h-4 w-4" /> تأكيد الطلب</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      <a href="https://wa.me/" target="_blank" rel="noopener"
        className="fixed bottom-6 left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30 bg-[#25D366] hover:scale-105 transition-transform">
        <MessageCircle className="h-6 w-6 text-background" />
      </a>

      {/* Floating cart */}
      {cartCount > 0 && !showCart && !selectedProduct && (
        <button onClick={openCartDrawer}
          className="fixed bottom-6 right-4 h-12 px-5 rounded-full bg-primary text-primary-foreground shadow-lg z-30 flex items-center gap-2 animate-in slide-in-from-bottom font-bold text-sm active:scale-95 transition-transform">
          <ShoppingCart className="h-4 w-4" />
          {cartCount} • {cartTotal.toLocaleString("ar-IQ")} د.ع
        </button>
      )}
    </div>
  );
};

export default Storefront;
