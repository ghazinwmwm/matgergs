import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, Menu, Star, Package, Heart, MapPin, Phone, Mail,
  X, Truck, Shield, CreditCard, ChevronLeft, Instagram, MessageCircle,
  Filter, Minus, Plus, Share2, ArrowRight, Clock, Check, Eye, Tag
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

  const categories = ["الكل", ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "الكل" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const getDiscountedPrice = (p: Product) => p.discount ? p.price - (p.price * p.discount / 100) : p.price;

  const storeName = activeStore?.name || "متجري";
  const storeWhatsapp = activeStore?.whatsapp || "";
  const storeLocation = activeStore?.location || "العراق";

  // Use dummy products if inventory is empty/has only 1 product
  const dummyProducts: Product[] = [
    { id: "d1", name: "سماعات لاسلكية Pro Max", description: "سماعات بلوتوث عالية الجودة مع عزل الضوضاء وبطارية تدوم ٣٠ ساعة", category: "إلكترونيات", price: 250000, discount: 30, images: [], sizes: [], colors: ["#000000", "#FFFFFF"], returnPolicy: "7-days", deliveryDays: 2, stock: 45 },
    { id: "d2", name: "حقيبة جلد طبيعي فاخرة", description: "حقيبة يد من الجلد الطبيعي الإيطالي، تصميم عصري وأنيق", category: "إكسسوارات", price: 180000, discount: 20, images: [], sizes: [], colors: ["#8B4513", "#000000"], returnPolicy: "7-days", deliveryDays: 3, stock: 22 },
    { id: "d3", name: "ساعة ذكية Ultra Series", description: "ساعة ذكية مع شاشة AMOLED ومقاومة للماء وتتبع اللياقة البدنية", category: "إلكترونيات", price: 450000, discount: 25, images: [], sizes: [], colors: ["#1A1A2E", "#C0C0C0"], returnPolicy: "14-days", deliveryDays: 2, stock: 15 },
    { id: "d4", name: "نظارة شمسية بولارايزد", description: "نظارة شمسية مستقطبة بإطار خفيف الوزن وحماية UV400", category: "إكسسوارات", price: 120000, discount: 0, images: [], sizes: [], colors: ["#000000", "#8B4513"], returnPolicy: "7-days", deliveryDays: 1, stock: 60 },
    { id: "d5", name: "عطر فاخر أصلي 100ml", description: "عطر فرنسي أصلي برائحة خشبية مع لمسات من العنبر والمسك", category: "أخرى", price: 320000, discount: 0, images: [], sizes: ["50ml", "100ml"], colors: [], returnPolicy: "no-return", deliveryDays: 1, stock: 35 },
    { id: "d6", name: "حذاء رياضي إير ماكس", description: "حذاء رياضي مريح بتقنية الوسادة الهوائية، مناسب للجري والتمارين", category: "أحذية", price: 280000, discount: 15, images: [], sizes: ["40", "41", "42", "43", "44"], colors: ["#000000", "#FFFFFF", "#FF0000"], returnPolicy: "14-days", deliveryDays: 3, stock: 28 },
    { id: "d7", name: "قميص كتان صيفي", description: "قميص من الكتان الطبيعي مثالي لأيام الصيف الحارة", category: "ملابس رجالية", price: 85000, discount: 10, images: [], sizes: ["S", "M", "L", "XL"], colors: ["#FFFFFF", "#87CEEB", "#F0E68C"], returnPolicy: "7-days", deliveryDays: 2, stock: 50 },
    { id: "d8", name: "شنطة ظهر للسفر", description: "شنطة ظهر واسعة ومقاومة للماء مع منفذ USB مدمج", category: "إكسسوارات", price: 95000, discount: 0, images: [], sizes: [], colors: ["#2F4F4F", "#000000"], returnPolicy: "7-days", deliveryDays: 2, stock: 40 },
  ];

  const displayProducts = products.length > 1 ? products : [...products, ...dummyProducts];
  const displayCategories = ["الكل", ...Array.from(new Set(displayProducts.map(p => p.category)))];
  const displayFiltered = displayProducts.filter(p => {
    const matchCat = activeCategory === "الكل" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Admin bar */}
      <div className="sticky top-0 z-50 bg-foreground text-background px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/")} className="w-7 h-7 rounded-full bg-background/20 flex items-center justify-center">
            <ArrowRight className="h-3.5 w-3.5 text-background" />
          </button>
          <div>
            <p className="text-[10px] font-medium text-background/80">أنت تشاهد متجرك كما يراه العملاء</p>
          </div>
        </div>
        <button onClick={() => navigate("/")} className="text-[10px] font-bold text-background/90 bg-background/15 px-3 py-1.5 rounded-full">
          العودة للوحة التحكم
        </button>
      </div>

      {/* Announcement bar */}
      <div className="text-center py-2 text-[10px] font-medium bg-primary text-primary-foreground">
        🎉 توصيل مجاني للطلبات فوق ١٠٠,٠٠٠ د.ع
      </div>

      {/* Store navbar */}
      <div className="sticky top-[40px] z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Menu className="h-5 w-5 text-foreground" />
          <span className="text-sm font-bold text-foreground">{storeName}</span>
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
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="px-5 py-12 text-center relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium mb-3 bg-primary/15 text-primary">
            ✨ {activeStore?.category || "تسوق أونلاين"}
          </span>
          <h1 className="text-2xl font-bold text-foreground mb-2">مرحباً بك في {storeName}</h1>
          <p className="text-xs text-muted-foreground mb-5 max-w-[280px] mx-auto">
            {activeStore?.description || "اكتشف تشكيلة واسعة من المنتجات المميزة بأسعار منافسة"}
          </p>
          <button onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-2.5 rounded-full text-sm font-bold bg-primary text-primary-foreground shadow-lg">
            تسوق الآن
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayCategories.map((cat, i) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div id="products-section" className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">المنتجات ({displayFiltered.length})</h2>
          <button className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> تصفية
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {displayFiltered.map((product) => {
            const finalPrice = getDiscountedPrice(product);
            return (
              <button key={product.id} onClick={() => setSelectedProduct(product)}
                className="rounded-2xl overflow-hidden text-right bg-card border border-border hover:shadow-md transition-shadow">
                <div className="h-36 relative flex items-center justify-center bg-muted/50">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-12 w-12 text-muted-foreground/20" />
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                    className="absolute top-2 left-2 w-8 h-8 rounded-full bg-card/90 flex items-center justify-center shadow-sm">
                    <Heart className="h-4 w-4" style={{ color: liked.includes(product.id) ? '#ef4444' : undefined, fill: liked.includes(product.id) ? '#ef4444' : 'none' }}
                      {...(!liked.includes(product.id) ? { className: "h-4 w-4 text-muted-foreground" } : {})} />
                  </button>
                  {product.discount > 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-bold bg-destructive text-destructive-foreground">
                      خصم {product.discount}٪
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-medium text-foreground mb-1 leading-tight line-clamp-2">{product.name}</p>
                  <div className="flex items-center gap-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-2.5 w-2.5 text-primary" style={{ fill: s <= 4 ? 'currentColor' : 'none' }} />
                    ))}
                    <span className="text-[8px] text-muted-foreground">(4.0)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-primary">{finalPrice.toLocaleString("ar-IQ")}</span>
                    <span className="text-[9px] text-muted-foreground">د.ع</span>
                    {product.discount > 0 && (
                      <span className="text-[9px] line-through text-muted-foreground">{product.price.toLocaleString("ar-IQ")}</span>
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

      {/* Features */}
      <div className="mx-4 mb-6 grid grid-cols-3 gap-2">
        {[
          { icon: Truck, label: "توصيل سريع", desc: "خلال ٢٤ ساعة" },
          { icon: Shield, label: "ضمان الجودة", desc: "إرجاع مجاني" },
          { icon: CreditCard, label: "دفع آمن", desc: "طرق متعددة" },
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
        <p className="text-base font-bold text-center text-foreground mb-4">{storeName}</p>
        <div className="flex justify-center gap-4 mb-4">
          {storeWhatsapp && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] text-foreground">{storeWhatsapp}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] text-foreground">{storeLocation}</span>
          </div>
        </div>
        <div className="flex justify-center gap-3 mb-4">
          {activeStore?.socialLinks?.instagram && <Instagram className="h-4 w-4 text-muted-foreground" />}
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          <Mail className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-center text-[9px] text-muted-foreground">© ٢٠٢٦ {storeName} - جميع الحقوق محفوظة</p>
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

          {/* Product image */}
          <div className="h-72 bg-muted/50 flex items-center justify-center relative">
            {selectedProduct.images?.[0] ? (
              <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="h-16 w-16 text-muted-foreground/20" />
            )}
            {selectedProduct.discount > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">
                خصم {selectedProduct.discount}٪
              </span>
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Name & price */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">{selectedProduct.name}</h2>
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

            {/* Colors */}
            {selectedProduct.colors.length > 0 && (
              <div>
                <p className="text-xs font-bold text-foreground mb-2">اللون</p>
                <div className="flex gap-2">
                  {selectedProduct.colors.map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 ${i === 0 ? "border-primary" : "border-border"}`} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {selectedProduct.sizes.length > 0 && (
              <div>
                <p className="text-xs font-bold text-foreground mb-2">المقاس</p>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map((size, i) => (
                    <button key={size} className={`w-10 h-10 rounded-xl text-xs font-medium flex items-center justify-center ${
                      i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <p className="text-xs font-bold text-foreground mb-1.5">الوصف</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
            </div>

            {/* Delivery info */}
            <div className="grid grid-cols-2 gap-2">
              {selectedProduct.deliveryDays && (
                <div className="flex items-center gap-2 rounded-xl p-3 bg-muted/50 border border-border">
                  <Truck className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-foreground">التوصيل</p>
                    <p className="text-[9px] text-muted-foreground">خلال {selectedProduct.deliveryDays} أيام</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 rounded-xl p-3 bg-muted/50 border border-border">
                <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-foreground">الإرجاع</p>
                  <p className="text-[9px] text-muted-foreground">
                    {selectedProduct.returnPolicy === "7-days" ? "خلال ٧ أيام" : selectedProduct.returnPolicy === "14-days" ? "خلال ١٤ يوم" : "غير قابل للإرجاع"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stock */}
            {selectedProduct.stock !== undefined && (
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${selectedProduct.stock > 5 ? "bg-green-500" : selectedProduct.stock > 0 ? "bg-yellow-500" : "bg-red-500"}`} />
                <span className="text-[10px] text-muted-foreground">
                  {selectedProduct.stock > 5 ? "متوفر" : selectedProduct.stock > 0 ? `آخر ${selectedProduct.stock} قطع` : "نفد من المخزون"}
                </span>
              </div>
            )}
          </div>

          {/* Bottom action */}
          <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-3">
            <button onClick={() => toggleLike(selectedProduct.id)}
              className="w-12 h-12 rounded-xl border border-border flex items-center justify-center bg-card">
              <Heart className="h-5 w-5" style={{ color: liked.includes(selectedProduct.id) ? '#ef4444' : undefined, fill: liked.includes(selectedProduct.id) ? '#ef4444' : 'none' }}
                {...(!liked.includes(selectedProduct.id) ? { className: "h-5 w-5 text-muted-foreground" } : {})} />
            </button>
            <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" /> أضف للسلة
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
                    return (
                      <div key={product.id} className="flex gap-3 p-4">
                        <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground/30" />
                          )}
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
                  <Check className="h-4 w-4" /> إتمام الطلب عبر واتساب
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      {storeWhatsapp && (
        <div className="fixed bottom-6 left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30" style={{ backgroundColor: '#25D366' }}>
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );
};

export default Storefront;
