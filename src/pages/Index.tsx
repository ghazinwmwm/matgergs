import { useState } from "react";
import { Package, Search, LayoutGrid, List, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AddProductDialog from "@/components/AddProductDialog";
import ProductCard from "@/components/ProductCard";
import ProductDetailDialog from "@/components/ProductDetailDialog";
import type { Product } from "@/types/product";
import { DEFAULT_CATEGORIES } from "@/types/product";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = (cat: string) => {
    setCategories((prev) => [...prev, cat]);
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  // Compute category counts
  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  // Filter products
  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "الكل" || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.includes(searchQuery) ||
      p.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Stats
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
          <AddProductDialog onAdd={addProduct} categories={categories} onAddCategory={addCategory} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="h-4 w-4" />
                <span className="text-xs">إجمالي المنتجات</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{products.length}</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <LayoutGrid className="h-4 w-4" />
                <span className="text-xs">الأصناف</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{Object.keys(categoryCounts).length}</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs">القيمة الإجمالية</span>
              </div>
              <span className="text-xl font-bold text-primary">{totalValue.toLocaleString("ar-IQ")} <span className="text-xs">د.ع</span></span>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <List className="h-4 w-4" />
                <span className="text-xs">بخصم</span>
              </div>
              <span className="text-2xl font-bold text-accent">{products.filter((p) => p.discount > 0).length}</span>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="pr-10"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("الكل")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "الكل"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              الكل
              <span className="mr-1 text-xs opacity-80">({products.length})</span>
            </button>
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {cat}
                  <span className="mr-1 text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Package className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">
              {products.length === 0 ? "لا توجد منتجات بعد" : "لا توجد نتائج"}
            </p>
            <p className="text-sm">
              {products.length === 0
                ? 'اضغط على "إضافة منتج" للبدء'
                : "جرب تغيير الصنف أو كلمة البحث"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={deleteProduct}
                onView={viewProduct}
              />
            ))}
          </div>
        )}
      </main>

      <ProductDetailDialog product={selectedProduct} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
};

export default Index;
