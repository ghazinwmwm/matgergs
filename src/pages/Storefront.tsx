import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, Star, Heart, X, Shield, CreditCard,
  Instagram, MessageCircle, Minus, Plus, ArrowRight, Download, Play,
  FileText, BookOpen, Award, User, Globe, Quote, Layers,
  Check, ChevronLeft, MapPin, Phone, Truck, Clock, Sparkles
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useStores } from "@/hooks/useStores";
import type { Product } from "@/types/product";

type CheckoutStep = "cart" | "info" | "confirm" | "success";

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

  // Checkout state
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "", city: "بغداد", notes: "" });
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

  const storeName = activeStore?.name || "أكاديمية نور";

  const dummyProducts: Product[] = [
    { id: "d1", name: "دورة تصميم UI/UX الشاملة", description: "من الصفر للاحتراف - تعلم Figma و Adobe XD مع مشاريع عملية تطبيقية. تشمل ٤٥ درس فيديو وملفات المشاريع.", category: "دورات", price: 75000, discount: 35, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d2", name: "دورة البرمجة بلغة Python", description: "تعلم البرمجة من الصفر مع تطبيقات عملية في تحليل البيانات والذكاء الاصطناعي.", category: "دورات", price: 60000, discount: 20, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d3", name: "كتاب التسويق الرقمي الشامل", description: "دليل شامل لاستراتيجيات التسويق الرقمي الحديثة مع أمثلة عملية. ٢٤٠ صفحة.", category: "كتب", price: 15000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d4", name: "قوالب تصميم سوشال ميديا", description: "٥٠ قالب احترافي قابل للتعديل لمنصات التواصل الاجتماعي بصيغة PSD و Canva.", category: "قوالب", price: 25000, discount: 15, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d5", name: "دورة التصوير الاحترافي", description: "تعلم أساسيات التصوير الفوتوغرافي مع تقنيات التعديل باستخدام Lightroom.", category: "دورات", price: 45000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d6", name: "دليل البرمجة للمبتدئين", description: "كتاب تعليمي يشرح أساسيات البرمجة بأسلوب مبسط. ١٨٠ صفحة.", category: "كتب", price: 12000, discount: 0, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d7", name: "حزمة أيقونات SVG احترافية", description: "١,٠٠٠ أيقونة بصيغة SVG قابلة للتخصيص.", category: "قوالب", price: 10000, discount: 30, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
    { id: "d8", name: "دورة إدارة المشاريع PMP", description: "استعد لاختبار PMP مع شرح مفصل وأسئلة تدريبية.", category: "دورات", price: 90000, discount: 25, images: [], sizes: [], colors: [], returnPolicy: "no-return", deliveryDays: null, stock: undefined },
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

  const openCartDrawer = () => { setCheckoutStep("cart"); setShowCart(true); };

  const handlePlaceOrder = () => {
    setCheckoutStep("success");
    setTimeout(() => {
      setCart([]);
      setCheckoutStep("cart");
      setShowCart(false);
      setCustomerInfo({ name: "", phone: "", email: "", city: "بغداد", notes: "" });
    }, 4000);
  };

  const isInfoValid = customerInfo.name.trim().length >= 2 && customerInfo.phone.trim().length >= 10;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin bar */}
      <div className="sticky top-0 z-50 bg-foreground text-background px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => { window.close(); navigate("/"); }} className="w-7 h-7 rounded-full bg-background/20 flex items-center justify-center">
            <ArrowRight className="h-3.5 w-3.5 text-background" />
          </button>
          <p className="text-[10px] font-medium text-background/80">معاينة المتجر</p>
        </div>
        <button onClick={() => { window.close(); navigate("/"); }} className="text-[10px] font-bold text-background/90 bg-background/15 px-3 py-1.5 rounded-full">
          إغلاق
        </button>
      </div>

      {/* Store navbar */}
      <div className="sticky top-[40px] z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-bold text-foreground">أكاديمية نور</span>
          <div className="flex gap-3 items-center">
            <button onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-5 w-5 text-foreground" />
            </button>
            <button onClick={openCartDrawer} className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center animate-in zoom-in">{cartCount}</span>
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
        <div className="px-5 py-10 text-center relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium mb-3 bg-primary/15 text-primary">
            🎓 +٥,٠٠٠ طالب يتعلمون معنا
          </span>
          <h1 className="text-xl font-bold text-foreground mb-2">طوّر مهاراتك الرقمية</h1>
          <p className="text-xs text-muted-foreground mb-4 max-w-[280px] mx-auto">
            دورات تعليمية، كتب إلكترونية، وأدوات رقمية من أفضل المدربين العرب
          </p>
          <button onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-primary text-primary-foreground shadow-lg">
            ابدأ التعلم
          </button>
        </div>
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
          <div className="h-40 flex items-center justify-center relative bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="h-7 w-7 text-primary" />
            </div>
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-bold bg-primary text-primary-foreground">الأكثر مبيعاً</span>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-1">{featuredCourse.name}</h3>
            <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2">{featuredCourse.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">{getDiscountedPrice(featuredCourse).toLocaleString("ar-IQ")}</span>
                <span className="text-[10px] text-muted-foreground mr-1">د.ع</span>
                {featuredCourse.discount > 0 && <span className="text-[10px] line-through text-muted-foreground mr-1">{featuredCourse.price.toLocaleString("ar-IQ")}</span>}
              </div>
              <span className="px-4 py-2 rounded-full text-xs font-bold bg-primary text-primary-foreground" onClick={(e) => { e.stopPropagation(); buyNow(featuredCourse); }}>اشتري الآن</span>
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
        <h2 className="text-sm font-bold text-foreground mb-3">جميع المنتجات ({displayFiltered.length})</h2>
        <div className="grid grid-cols-2 gap-3">
          {displayFiltered.map((product) => {
            const finalPrice = getDiscountedPrice(product);
            const Icon = getProductIcon(product.category);
            const fileType = getFileType(product.category);
            return (
              <div key={product.id} className="rounded-2xl overflow-hidden text-right bg-card border border-border hover:shadow-md transition-shadow">
                <button onClick={() => setSelectedProduct(product)} className="w-full text-right">
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
                    <div className="flex items-center gap-1 mb-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-2 w-2 text-primary" style={{ fill: s <= 4 ? 'currentColor' : 'none' }} />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-primary">{finalPrice.toLocaleString("ar-IQ")}</span>
                      <span className="text-[8px] text-muted-foreground">د.ع</span>
                    </div>
                  </div>
                </button>
                {/* Quick buy button */}
                <div className="px-3 pb-3">
                  <button onClick={() => buyNow(product)}
                    className="w-full py-2 rounded-xl text-[10px] font-bold bg-primary text-primary-foreground flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                    <Sparkles className="h-3 w-3" /> شراء سريع
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-4 pb-6">
        <h2 className="text-sm font-bold text-foreground mb-3">ماذا يقول طلابنا 💬</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { name: "سارة أحمد", text: "دورة رائعة! تعلمت التصميم من الصفر وحصلت على عمل خلال شهرين 🙏", rating: 5 },
            { name: "محمد علي", text: "المحتوى ممتاز والشرح واضح. أفضل منصة عربية للتعلم.", rating: 5 },
            { name: "ريم حسين", text: "الكتب الإلكترونية مفيدة جداً وبأسعار ممتازة!", rating: 4 },
          ].map((t) => (
            <div key={t.name} className="flex-shrink-0 w-60 rounded-xl p-3 bg-card border border-border">
              <Quote className="h-4 w-4 mb-2 text-primary/20" />
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{t.text}</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">{t.name[0]}</div>
                <span className="text-[10px] font-medium text-foreground">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mx-4 mb-6 grid grid-cols-3 gap-2">
        {[
          { icon: Download, label: "تحميل فوري" },
          { icon: Shield, label: "محتوى محمي" },
          { icon: Award, label: "شهادات" },
        ].map((f) => (
          <div key={f.label} className="rounded-xl p-3 text-center bg-card border border-border">
            <f.icon className="h-5 w-5 mx-auto mb-1.5 text-primary" />
            <p className="text-[10px] font-bold text-foreground">{f.label}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-6 bg-muted/50 border-t border-border">
        <p className="text-sm font-bold text-center text-foreground mb-1">أكاديمية نور</p>
        <p className="text-[10px] text-center text-muted-foreground mb-3">محتوى رقمي عربي متميز</p>
        <div className="flex justify-center gap-4 mb-2">
          <Instagram className="h-4 w-4 text-muted-foreground" />
          <Globe className="h-4 w-4 text-muted-foreground" />
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-center text-[8px] text-muted-foreground">مدعوم من <span className="font-bold text-primary">Matager</span></p>
      </div>

      {/* Product Detail Modal */}
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

          <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center relative">
            {(() => { const Icon = getProductIcon(selectedProduct.category); return <Icon className="h-14 w-14 text-primary/20" />; })()}
            <span className="mt-2 text-[10px] px-3 py-1 rounded-full font-medium bg-primary/10 text-primary">{getFileType(selectedProduct.category)}</span>
            {selectedProduct.discount > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">خصم {selectedProduct.discount}٪</span>
            )}
          </div>

          <div className="p-4 space-y-4">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{selectedProduct.category}</span>
              <h2 className="text-lg font-bold text-foreground mt-2 mb-1">{selectedProduct.name}</h2>
              <div className="flex items-center gap-2 mb-2">
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

            <div>
              <p className="text-xs font-bold text-foreground mb-1">الوصف</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-foreground mb-2">ماذا ستحصل عليه</p>
              <div className="space-y-2">
                {[
                  { icon: Download, text: "تحميل فوري بعد الشراء" },
                  { icon: Shield, text: "وصول مدى الحياة" },
                  { icon: Award, text: "شهادة إتمام" },
                  { icon: MessageCircle, text: "دعم فني" },
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
          </div>

          {/* Bottom action — TWO buttons for fewest clicks */}
          <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2">
            <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
              className="h-12 px-4 rounded-xl border border-border bg-card text-foreground font-bold text-xs flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" /> أضف للسلة
            </button>
            <button onClick={() => buyNow(selectedProduct)}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" /> اشتري الآن
            </button>
          </div>
        </div>
      )}

      {/* Full Checkout Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => { setShowCart(false); setCheckoutStep("cart"); }} />
          <div className="absolute inset-y-0 left-0 w-full bg-background shadow-xl flex flex-col animate-in slide-in-from-bottom duration-300">

            {/* Header with steps */}
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
              {/* Progress bar */}
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

              {/* STEP: Cart */}
              {checkoutStep === "cart" && (
                <>
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
                            <button onClick={() => updateCartQty(product.id, -qty)} className="self-start mt-1">
                              <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* STEP: Info — single form, fewest inputs */}
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

                  {/* Payment method */}
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
                        <Truck className={`h-5 w-5 mx-auto mb-1 ${paymentMethod === "cod" ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="text-[10px] font-bold text-foreground">عند الاستلام</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-foreground mb-1 block">ملاحظات <span className="text-muted-foreground">(اختياري)</span></label>
                    <textarea value={customerInfo.notes} onChange={(e) => setCustomerInfo(p => ({ ...p, notes: e.target.value }))}
                      className="w-full h-20 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                      placeholder="أي ملاحظات إضافية..." />
                  </div>
                </div>
              )}

              {/* STEP: Confirm */}
              {checkoutStep === "confirm" && (
                <div className="p-4 space-y-4">
                  {/* Order summary */}
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

                  {/* Customer info summary */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <h3 className="text-xs font-bold text-foreground">معلومات العميل</h3>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[11px] text-foreground">{customerInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[11px] text-foreground" dir="ltr">{customerInfo.phone}</span>
                    </div>
                    {customerInfo.email && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[11px] text-foreground" dir="ltr">{customerInfo.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[11px] text-foreground">{paymentMethod === "electronic" ? "دفع إلكتروني" : "الدفع عند الاستلام"}</span>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="flex gap-3 justify-center">
                    {[
                      { icon: Shield, label: "آمن ١٠٠٪" },
                      { icon: Clock, label: "تسليم فوري" },
                    ].map((b) => (
                      <div key={b.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <b.icon className="h-3.5 w-3.5 text-primary" />
                        {b.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP: Success */}
              {checkoutStep === "success" && (
                <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-in zoom-in">
                    <Check className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">تم تأكيد طلبك! 🎉</h2>
                  <p className="text-sm text-muted-foreground mb-1">رقم الطلب: #{ Math.floor(1000 + Math.random() * 9000) }</p>
                  <p className="text-xs text-muted-foreground mb-6">سيتم إرسال رابط التحميل إلى بريدك الإلكتروني وواتساب</p>
                  <div className="flex gap-3 justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      <Download className="h-3.5 w-3.5" /> تحميل فوري
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
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
      <div className="fixed bottom-6 left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30" style={{ backgroundColor: '#25D366' }}>
        <MessageCircle className="h-6 w-6 text-white" />
      </div>

      {/* Floating cart badge */}
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
