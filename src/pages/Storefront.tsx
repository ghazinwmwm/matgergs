import { useState } from "react";
import {
  Search, ShoppingCart, Star, Heart, X, Shield, CreditCard,
  Instagram, MessageCircle, Minus, Plus, ArrowRight, Download, Play,
  FileText, BookOpen, Award, User, Globe, Quote, Layers,
  Check, ChevronLeft, Phone, Sparkles, ArrowDown, Mail,
  Palette, Code, Camera, PenTool, Monitor, Briefcase,
  ChevronRight, ExternalLink, Menu, Zap, Heart as HeartIcon
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useTemplateConfig } from "@/hooks/useTemplateConfig";
import { getIconComponent } from "@/pages/TemplateEditor";
import type { Product } from "@/types/product";

type CheckoutStep = "cart" | "info" | "confirm" | "success";

const ICON_MAP: Record<string, React.ElementType> = {
  Palette, Monitor, Code, Camera, PenTool, Briefcase, Sparkles, Zap, HeartIcon, Star, 
};

const Storefront = () => {
  const { products } = useInventory();
  const { config, getActiveColors, storefrontCssVars } = useTemplateConfig();
  const colors = getActiveColors();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  const dummyProducts: Product[] = [
    { id: "d1", name: "دورة تصميم UI/UX الشاملة", description: "من الصفر للاحتراف - تعلم Figma و Adobe XD مع ٤٥ درس فيديو.", category: "دورات", price: 75000, discount: 35, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d2", name: "دورة البرمجة بلغة Python", description: "تعلم البرمجة من الصفر مع تطبيقات عملية. ٦٠ درس.", category: "دورات", price: 60000, discount: 20, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d3", name: "كتاب التسويق الرقمي الشامل", description: "دليل شامل لاستراتيجيات التسويق. ٢٤٠ صفحة.", category: "كتب", price: 15000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d4", name: "قوالب تصميم سوشال ميديا", description: "٥٠ قالب احترافي بصيغة PSD و Canva.", category: "قوالب", price: 25000, discount: 15, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d5", name: "دورة التصوير الاحترافي", description: "أساسيات التصوير مع Lightroom و Photoshop.", category: "دورات", price: 45000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d6", name: "حزمة أيقونات SVG احترافية", description: "١,٠٠٠ أيقونة بصيغة SVG.", category: "قوالب", price: 10000, discount: 30, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
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

  // Build enabled sections in order
  const enabledSections = config.sections.filter(s => s.enabled);
  const isSectionEnabled = (id: string) => enabledSections.some(s => s.id === id || s.id.startsWith(id));
  const storeEnabled = isSectionEnabled("store");

  // Dynamic nav items from enabled sections
  const sectionIdToNav: Record<string, { id: string; label: string }> = {
    hero: { id: "hero-section", label: "الرئيسية" },
    services: { id: "services-section", label: "الخدمات" },
    works: { id: "works-section", label: "الأعمال" },
    store: { id: "store-section", label: "المتجر" },
    testimonials: { id: "testimonials-section", label: "آراء العملاء" },
    about: { id: "about-section", label: "من نحن" },
  };

  const navItems = enabledSections
    .filter(s => sectionIdToNav[s.id])
    .map(s => sectionIdToNav[s.id]);

  // Style overrides from config
  const storeStyle: React.CSSProperties = {
    fontFamily: config.bodyFont,
    fontSize: `${config.baseFontSize}px`,
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: config.headingFont,
  };

  // ═══════════════════════════════════════
  // RENDER SECTIONS IN ORDER
  // ═══════════════════════════════════════

  const renderSection = (section: typeof enabledSections[0]) => {
    const baseId = section.id.split("-")[0]; // handle duplicated sections like "services-copy-123"

    switch (baseId) {
      case "hero":
        return (
          <section key={section.id} id="hero-section" className="relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${colors.primary}0F, transparent)` }} />
            <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: `${colors.primary}0A` }} />
            <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full blur-3xl" style={{ backgroundColor: `${colors.accent}0A` }} />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6 border" style={{ backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` }}>
                  <Zap className="h-3 w-3" style={{ color: colors.primary }} />
                  <span className="text-[11px] font-semibold" style={{ color: colors.primary }}>منتجات رقمية • دورات • خدمات احترافية</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 tracking-tight" style={{ ...headingStyle, color: colors.text }}>
                  {config.tagline.split(" ").slice(0, Math.ceil(config.tagline.split(" ").length / 2)).join(" ")}
                  <br />
                  <span style={{ color: colors.primary }}>{config.tagline.split(" ").slice(Math.ceil(config.tagline.split(" ").length / 2)).join(" ")}</span>
                </h1>

                <p className="text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed" style={{ color: `${colors.text}99` }}>
                  {config.storeDescription}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button onClick={() => scrollTo("store-section")}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all"
                    style={{ backgroundColor: colors.primary, boxShadow: `0 10px 25px -5px ${colors.primary}40` }}>
                    {config.heroButtonText}
                  </button>
                  <button onClick={() => scrollTo("works-section")}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-card border border-border text-foreground hover:bg-muted transition-colors">
                    {config.heroSecondaryButton}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-8 mt-12">
                  {[
                    { value: "٥,٠٠٠+", label: "عميل سعيد" },
                    { value: "١٥٠+", label: "منتج رقمي" },
                    { value: "٤.٩", label: "تقييم" },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-xl sm:text-2xl font-extrabold" style={{ ...headingStyle, color: colors.text }}>{s.value}</p>
                      <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: `${colors.text}66` }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
              <ArrowDown className="h-4 w-4 text-muted-foreground animate-bounce" />
            </div>
          </section>
        );

      case "services":
        return (
          <section key={section.id} id="services-section" className="py-16 sm:py-20" style={{ backgroundColor: `${colors.primary}06` }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}>خدماتنا</span>
                <h2 className="text-xl sm:text-2xl font-bold mt-4" style={{ ...headingStyle, color: colors.text }}>ماذا نقدم لك؟</h2>
                <p className="text-xs sm:text-sm mt-2 max-w-md mx-auto" style={{ color: `${colors.text}88` }}>حلول رقمية شاملة تغطي جميع احتياجاتك</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {config.services.map((s) => {
                  const SIcon = getIconComponent(s.icon);
                  return (
                    <div key={s.title} className="bg-card border border-border rounded-2xl p-4 sm:p-5 text-center hover:shadow-md transition-all group cursor-pointer"
                      style={{ '--hover-border': `${colors.primary}40` } as React.CSSProperties}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors"
                        style={{ backgroundColor: `${colors.primary}15` }}>
                        <SIcon className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1">{s.title}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case "works":
        return (
          <section key={section.id} id="works-section" className="py-16 sm:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}>معرض الأعمال</span>
                <h2 className="text-xl sm:text-2xl font-bold mt-4" style={{ ...headingStyle, color: colors.text }}>أعمال نفتخر بها</h2>
                <p className="text-xs sm:text-sm mt-2" style={{ color: `${colors.text}88` }}>نماذج من مشاريعنا الناجحة</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {config.works.map((work, i) => {
                  const Wrapper = work.link ? 'a' : 'div';
                  const wrapperProps = work.link ? { href: work.link, target: "_blank", rel: "noopener noreferrer" } : {};
                  return (
                    <Wrapper key={i} {...wrapperProps as any} className="group cursor-pointer block">
                      <div className="aspect-[4/3] rounded-2xl flex items-center justify-center relative overflow-hidden border border-border"
                        style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}15)` }}>
                        <PenTool className="h-8 w-8 text-muted-foreground/20" />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="text-center">
                            <ExternalLink className="h-5 w-5 text-background mx-auto mb-1.5" />
                            <p className="text-[10px] font-bold text-background">{work.link ? 'فتح الرابط' : 'عرض المشروع'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2.5 px-1">
                        <h3 className="text-xs font-bold text-foreground">{work.title}</h3>
                        <p className="text-[10px] text-muted-foreground">{work.category}</p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case "store":
        return (
          <section key={section.id} id="store-section" className="py-16 sm:py-20" style={{ backgroundColor: `${colors.primary}06` }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-8">
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}>المتجر الرقمي</span>
                <h2 className="text-xl sm:text-2xl font-bold mt-4" style={{ ...headingStyle, color: colors.text }}>منتجات رقمية مميزة</h2>
                <p className="text-xs sm:text-sm mt-2" style={{ color: `${colors.text}88` }}>دورات، كتب، قوالب وأدوات تساعدك</p>
              </div>

              <div className="max-w-md mx-auto mb-6">
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-card border border-border">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن دورة، كتاب، أو قالب..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
                  {searchQuery && <button onClick={() => setSearchQuery("")}><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-3 mb-6 justify-center">
                {displayCategories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeCategory === cat ? "text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                    style={activeCategory === cat ? { backgroundColor: colors.primary } : undefined}>
                    {cat}
                  </button>
                ))}
              </div>

              {displayProducts.length > 0 && (
                <div className="mb-8">
                  <button onClick={() => setSelectedProduct(displayProducts[0])}
                    className="w-full sm:max-w-2xl sm:mx-auto block rounded-2xl overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow text-right">
                    <div className="sm:flex">
                      <div className="h-44 sm:h-auto sm:w-64 flex items-center justify-center relative"
                        style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}08)` }}>
                        <Play className="h-12 w-12" style={{ color: `${colors.primary}30` }} />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: colors.primary }}>⭐ الأكثر مبيعاً</span>
                      </div>
                      <div className="p-5 flex-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{displayProducts[0].category}</span>
                        <h3 className="text-base font-bold text-foreground mt-2 mb-1">{displayProducts[0].name}</h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{displayProducts[0].description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold" style={{ color: colors.primary }}>{getDiscountedPrice(displayProducts[0]).toLocaleString("ar-IQ")}</span>
                            <span className="text-xs text-muted-foreground mr-1">د.ع</span>
                            {displayProducts[0].discount > 0 && <span className="text-xs line-through text-muted-foreground mr-2">{displayProducts[0].price.toLocaleString("ar-IQ")}</span>}
                          </div>
                          <span onClick={(e) => { e.stopPropagation(); buyNow(displayProducts[0]); }}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white active:scale-95 transition-transform cursor-pointer"
                            style={{ backgroundColor: colors.primary }}>
                            اشتري الآن
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {displayFiltered.slice(1).map((product) => {
                  const finalPrice = getDiscountedPrice(product);
                  const Icon = getProductIcon(product.category);
                  return (
                    <div key={product.id} className="rounded-2xl overflow-hidden bg-card border border-border hover:shadow-md transition-all group">
                      <button onClick={() => setSelectedProduct(product)} className="w-full text-right">
                        <div className="h-32 sm:h-36 relative flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-muted/50 to-muted/20">
                          <Icon className="h-8 w-8 text-muted-foreground/15 group-hover:scale-110 transition-transform" />
                          <span className="text-[8px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>{getFileType(product.category)}</span>
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
                              <Star key={s} className="h-2.5 w-2.5" style={{ color: colors.primary, fill: s <= 4 ? 'currentColor' : 'none' }} />
                            ))}
                            <span className="text-[8px] text-muted-foreground">(4.0)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold" style={{ color: colors.primary }}>{finalPrice.toLocaleString("ar-IQ")}</span>
                            <span className="text-[8px] text-muted-foreground">د.ع</span>
                          </div>
                        </div>
                      </button>
                      <div className="px-3 pb-3">
                        <button onClick={() => buyNow(product)}
                          className="w-full py-2.5 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                          style={{ backgroundColor: colors.primary }}>
                          <Sparkles className="h-3 w-3" /> شراء سريع
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case "testimonials":
        return (
          <section key={section.id} id="testimonials-section" className="py-16 sm:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}>آراء العملاء</span>
                <h2 className="text-xl sm:text-2xl font-bold mt-4" style={{ ...headingStyle, color: colors.text }}>ماذا يقولون عنا؟</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {config.testimonials.map((t) => (
                  <div key={t.name} className="bg-card border border-border rounded-2xl p-4 hover:shadow-sm transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <Quote className="h-5 w-5 mb-3" style={{ color: `${colors.primary}25` }} />
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.text}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>{t.name[0]}</div>
                      <div>
                        <p className="text-[11px] font-bold text-foreground">{t.name}</p>
                        <p className="text-[9px] text-muted-foreground">{t.role}</p>
                      </div>
                      <div className="flex gap-0.5 mr-auto">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="h-2.5 w-2.5" style={{ color: colors.primary, fill: s <= t.rating ? 'currentColor' : 'none' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "cta":
        return (
          <section key={section.id} className="py-16 sm:py-20" style={{ backgroundColor: `${colors.primary}08` }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
              <div className="max-w-lg mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ ...headingStyle, color: colors.text }}>{config.ctaTitle}</h2>
                <p className="text-xs sm:text-sm mb-6" style={{ color: `${colors.text}88` }}>{config.ctaDesc}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button onClick={() => scrollTo("store-section")}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg"
                    style={{ backgroundColor: colors.primary, boxShadow: `0 10px 25px -5px ${colors.primary}30` }}>
                    {config.ctaButton}
                  </button>
                  <a href={`https://wa.me/${config.whatsappNumber || config.contactPhone.replace(/\s+/g, '')}`} target="_blank" rel="noopener"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-card border border-border text-foreground flex items-center justify-center gap-2">
                    <MessageCircle className="h-4 w-4" /> تواصل واتساب
                  </a>
                </div>
              </div>
            </div>
          </section>
        );

      case "about":
        return (
          <section key={section.id} id="about-section" className="py-16 sm:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="sm:flex items-start gap-10">
                <div className="flex-1 mb-8 sm:mb-0">
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}>من نحن</span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-4 mb-3" style={{ ...headingStyle, color: colors.text }}>فريق شغوف بالإبداع الرقمي</h2>
                  <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: `${colors.text}99` }}>
                    {config.aboutText}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {config.aboutFeatures.map(f => (
                      <div key={f} className="rounded-xl bg-card border border-border p-3 text-center">
                        <Award className="h-4 w-4 mx-auto mb-1.5" style={{ color: colors.primary }} />
                        <p className="text-[9px] sm:text-[10px] font-bold text-foreground">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4" style={headingStyle}>تواصل معنا</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Mail, text: config.contactEmail, dir: "ltr" as const },
                        { icon: Phone, text: config.contactPhone, dir: "ltr" as const },
                        { icon: Instagram, text: config.contactInstagram },
                        { icon: Globe, text: config.contactWebsite, dir: "ltr" as const },
                      ].filter(c => c.text).map(c => (
                        <div key={c.text} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}15` }}>
                            <c.icon className="h-3.5 w-3.5" style={{ color: colors.primary }} />
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ ...storeStyle, ...storefrontCssVars, backgroundColor: colors.bg, color: colors.text }}>

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-border" style={{ backgroundColor: `${colors.bg}CC` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              {config.logoImage ? (
                <img src={config.logoImage} alt={config.storeName} className="w-8 h-8 rounded-xl object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <span className="text-sm font-bold" style={{ ...headingStyle, color: colors.text }}>{config.storeName}</span>
            </div>

            <div className="hidden sm:flex items-center gap-6">
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="text-xs font-medium transition-colors" style={{ color: `${colors.text}88` }}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={openCartDrawer} className="relative w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <ShoppingCart className="h-4 w-4 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full text-[8px] font-bold flex items-center justify-center animate-in zoom-in text-white" style={{ backgroundColor: colors.primary }}>{cartCount}</span>
                )}
              </button>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="sm:hidden w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
                {showMobileMenu ? <X className="h-4 w-4 text-foreground" /> : <Menu className="h-4 w-4 text-foreground" />}
              </button>
            </div>
          </div>
        </div>

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

      {/* ══════════════ DYNAMIC SECTIONS ══════════════ */}
      {enabledSections.map(section => renderSection(section))}

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {config.logoImage ? (
                <img src={config.logoImage} alt={config.storeName} className="w-7 h-7 rounded-lg object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <span className="text-xs font-bold text-foreground">{config.storeName}</span>
            </div>
            <div className="flex items-center gap-4">
              {config.contactInstagram && <Instagram className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />}
              {config.contactWebsite && <Globe className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />}
              {(config.whatsappNumber || config.contactPhone) && <MessageCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />}
            </div>
            <p className="text-[10px] text-muted-foreground">
              مدعوم من <span className="font-bold" style={{ color: colors.primary }}>Matager</span> • © ٢٠٢٦
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
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center text-white" style={{ backgroundColor: colors.primary }}>{cartCount}</span>}
            </button>
          </div>

          <div className="h-52 flex flex-col items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}08)` }}>
            {(() => { const Icon = getProductIcon(selectedProduct.category); return <Icon className="h-14 w-14" style={{ color: `${colors.primary}30` }} />; })()}
            <span className="mt-2 text-[10px] px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>{getFileType(selectedProduct.category)}</span>
            {selectedProduct.discount > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">خصم {selectedProduct.discount}٪</span>
            )}
          </div>

          <div className="max-w-2xl mx-auto p-5 space-y-5">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{selectedProduct.category}</span>
              <h2 className="text-lg font-bold text-foreground mt-2 mb-1" style={headingStyle}>{selectedProduct.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3 w-3" style={{ color: colors.primary, fill: s <= 4 ? 'currentColor' : 'none' }} />)}
                </div>
                <span className="text-[11px] text-muted-foreground">(4.0) • ١٢٨ تقييم</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold" style={{ color: colors.primary }}>{getDiscountedPrice(selectedProduct).toLocaleString("ar-IQ")}</span>
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
                    <item.icon className="h-3.5 w-3.5" style={{ color: colors.primary }} />
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
              className="flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-white"
              style={{ backgroundColor: colors.primary }}>
              <Sparkles className="h-4 w-4" /> اشتري الآن
            </button>
          </div>
        </div>
      )}

      {/* ══════════════ CHECKOUT DRAWER (SINGLE PAGE) ══════════════ */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => { setShowCart(false); setCheckoutStep("cart"); }} />
          <div className="absolute inset-y-0 left-0 w-full sm:max-w-md sm:right-0 sm:left-auto bg-background shadow-xl flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-left duration-300">

            <div className="border-b border-border">
              <div className="flex items-center justify-between px-4 py-3">
                <button onClick={() => { setShowCart(false); setCheckoutStep("cart"); }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="h-4 w-4 text-foreground" />
                </button>
                <h2 className="text-sm font-bold text-foreground">
                  {checkoutStep === "success" ? "تم الطلب ✓" : `إتمام الشراء (${cartCount})`}
                </h2>
                <div className="w-8" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {checkoutStep === "success" ? (
                <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in" style={{ backgroundColor: `${colors.primary}15` }}>
                    <Check className="h-10 w-10" style={{ color: colors.primary }} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">تم تأكيد طلبك! 🎉</h2>
                  <p className="text-sm text-muted-foreground mb-1">رقم الطلب: #{Math.floor(1000 + Math.random() * 9000)}</p>
                  <p className="text-xs text-muted-foreground mb-6">سيتم التواصل معك عبر الواتساب</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                      <Download className="h-3.5 w-3.5" /> تحميل فوري
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                      <MessageCircle className="h-3.5 w-3.5" /> واتساب
                    </div>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-sm">السلة فارغة</p>
                </div>
              ) : (
                <div className="p-4 space-y-5">
                  {/* Cart Items */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-foreground">المنتجات</p>
                    {cart.map(({ product, qty }) => {
                      const price = getDiscountedPrice(product);
                      const Icon = getProductIcon(product.category);
                      return (
                        <div key={product.id} className="flex gap-3 bg-muted/30 rounded-xl p-3">
                          <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-muted-foreground/30" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-foreground line-clamp-1">{product.name}</p>
                            <p className="text-[11px] font-bold mt-0.5" style={{ color: colors.primary }}>{price.toLocaleString("ar-IQ")} د.ع</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => updateCartQty(product.id, -1)} className="w-6 h-6 rounded-lg border border-border flex items-center justify-center">
                              <Minus className="h-3 w-3 text-foreground" />
                            </button>
                            <span className="text-[11px] font-bold text-foreground w-5 text-center">{qty}</span>
                            <button onClick={() => updateCartQty(product.id, 1)} className="w-6 h-6 rounded-lg text-white flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button onClick={() => updateCartQty(product.id, -qty)} className="self-center">
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-foreground">معلومات الطلب</p>
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-1 block">الاسم الكامل *</label>
                      <input value={customerInfo.name} onChange={(e) => setCustomerInfo(p => ({ ...p, name: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                        placeholder="الاسم الكامل" />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-1 block">رقم الهاتف *</label>
                      <input value={customerInfo.phone} onChange={(e) => setCustomerInfo(p => ({ ...p, phone: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                        placeholder="07701234567" type="tel" dir="ltr" />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-1 block">البريد الإلكتروني</label>
                      <input value={customerInfo.email} onChange={(e) => setCustomerInfo(p => ({ ...p, email: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                        placeholder="email@example.com" type="email" dir="ltr" />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="text-xs font-bold text-foreground mb-2">طريقة الدفع</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setPaymentMethod("electronic")}
                        className="p-3 rounded-xl border-2 text-center transition-all"
                        style={paymentMethod === "electronic" ? { borderColor: colors.primary, backgroundColor: `${colors.primary}08` } : { borderColor: 'var(--border)' }}>
                        <CreditCard className="h-4 w-4 mx-auto mb-1" style={{ color: paymentMethod === "electronic" ? colors.primary : undefined }} />
                        <p className="text-[10px] font-bold text-foreground">دفع إلكتروني</p>
                      </button>
                      <button onClick={() => setPaymentMethod("cod")}
                        className="p-3 rounded-xl border-2 text-center transition-all"
                        style={paymentMethod === "cod" ? { borderColor: colors.primary, backgroundColor: `${colors.primary}08` } : { borderColor: 'var(--border)' }}>
                        <Download className="h-4 w-4 mx-auto mb-1" style={{ color: paymentMethod === "cod" ? colors.primary : undefined }} />
                        <p className="text-[10px] font-bold text-foreground">تحويل</p>
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">ملاحظات (اختياري)</label>
                    <textarea value={customerInfo.notes} onChange={(e) => setCustomerInfo(p => ({ ...p, notes: e.target.value }))}
                      className="w-full h-16 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                      placeholder="ملاحظات..." />
                  </div>
                </div>
              )}
            </div>

            {checkoutStep !== "success" && cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">المجموع</span>
                  <span className="text-lg font-bold" style={{ color: colors.primary }}>{cartTotal.toLocaleString("ar-IQ")} <span className="text-xs text-muted-foreground">د.ع</span></span>
                </div>
                <button
                  disabled={!isInfoValid}
                  onClick={handlePlaceOrder}
                  className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform text-white"
                  style={{ backgroundColor: colors.primary }}>
                  <Check className="h-4 w-4" /> تأكيد الطلب
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${config.whatsappNumber || config.contactPhone.replace(/\s+/g, '')}`} target="_blank" rel="noopener"
        className="fixed bottom-6 left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30 bg-[#25D366] hover:scale-105 transition-transform">
        <MessageCircle className="h-6 w-6 text-white" />
      </a>

      {/* Floating cart */}
      {cartCount > 0 && !showCart && !selectedProduct && (
        <button onClick={openCartDrawer}
          className="fixed bottom-6 right-4 h-12 px-5 rounded-full shadow-lg z-30 flex items-center gap-2 animate-in slide-in-from-bottom font-bold text-sm active:scale-95 transition-transform text-white"
          style={{ backgroundColor: colors.primary }}>
          <ShoppingCart className="h-4 w-4" />
          {cartCount} • {cartTotal.toLocaleString("ar-IQ")} د.ع
        </button>
      )}
    </div>
  );
};

export default Storefront;
