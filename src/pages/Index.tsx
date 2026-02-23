import { useState } from "react";
import { Package, Search, LayoutGrid, List, BarChart3, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import ProductDetailDialog from "@/components/ProductDetailDialog";
import type { Product } from "@/types/product";
import { DEFAULT_CATEGORIES } from "@/types/product";
import sampleProductImg from "@/assets/sample-product.jpg";

const SAMPLE_PRODUCT: Product = {
  id: "sample-1",
  name: "قميص بولو رجالي كلاسيكي",
  description: "قميص بولو أنيق مصنوع من القطن الممتاز، مريح للارتداء اليومي والمناسبات غير الرسمية.",
  category: "ملابس رجالية",
  price: 35000,
  discount: 15,
  image: sampleProductImg,
  sizes: ["S", "M", "L", "XL"],
  colors: ["#1E3A5F", "#000000", "#FFFFFF"],
};

let sharedProducts: Product[] = [SAMPLE_PRODUCT];
let sharedCategories: string[] = [...DEFAULT_CATEGORIES];
const listeners: Set<() => void> = new Set();

export function useInventory() {
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  useState(() => {
    listeners.add(rerender);
    return () => listeners.delete(rerender);
  });

  const notify = () => listeners.forEach((fn) => fn());

  return {
    products: sharedProducts,
    categories: sharedCategories,
    addProduct: (p: Product) => { sharedProducts = [p, ...sharedProducts]; notify(); },
    deleteProduct: (id: string) => { sharedProducts = sharedProducts.filter((p) => p.id !== id); notify(); },
    addCategory: (cat: string) => {
      if (!sharedCategories.includes(cat)) { sharedCategories = [...sharedCategories, cat]; notify(); }
    },
  };
}

const Index = () => {
  const navigate = useNavigate();
  const { products, deleteProduct } = useInventory();
  const [activeCategory, setActiveCategory] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const viewProduct = (product: Product) => { setSelectedProduct(product); setDetailOpen(true); };

  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "الكل" || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const totalValue = products.reduce((sum, p) => {
    const final = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
    return sum + final;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">إدارة المخزون</h1>
              <p className="text-xs text-muted-foreground">{products.length} منتج</p>
            </div>
          </div>
          <Button onClick={() => navigate("/add")} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة منتج
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-5">
        {/* Stats */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Package className="h-3 w-3" /> المنتجات</span>
              <span className="text-xl font-bold text-foreground block">{products.length}</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><LayoutGrid className="h-3 w-3" /> الأصناف</span>
              <span className="text-xl font-bold text-foreground block">{Object.keys(categoryCounts).length}</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><BarChart3 className="h-3 w-3" /> القيمة</span>
              <span className="text-lg font-bold text-primary block">{totalValue.toLocaleString("ar-IQ")} <span className="text-[10px]">د.ع</span></span>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><List className="h-3 w-3" /> بخصم</span>
              <span className="text-xl font-bold text-accent block">{products.filter((p) => p.discount > 0).length}</span>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن منتج..." className="pr-10" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("الكل")}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm transition-colors ${activeCategory === "الكل" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
              الكل ({products.length})
            </button>
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-sm transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
              >
                {cat} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Package className="h-14 w-14 mb-3 opacity-30" />
            <p className="text-base font-medium">{products.length === 0 ? "لا توجد منتجات بعد" : "لا توجد نتائج"}</p>
            <p className="text-sm">{products.length === 0 ? 'اضغط + للبدء' : "غيّر الصنف أو البحث"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onDelete={deleteProduct} onView={viewProduct} />
            ))}
          </div>
        )}
      </main>

      <ProductDetailDialog product={selectedProduct} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
};

export default Index;
