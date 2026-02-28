import { useState } from "react";
import { Package, Search, LayoutGrid, List, BarChart3, Plus, Store, ChevronDown, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import ProductDetailDialog from "@/components/ProductDetailDialog";
import type { Product } from "@/types/product";
import { useInventory } from "@/hooks/useInventory";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, lowStockProducts } = useInventory();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>(t.all);
  const [selectedStore, setSelectedStore] = useState("المتجر الرئيسي");
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const stores = ["المتجر الرئيسي", "فرع المنصور", "فرع الكرادة"];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const viewProduct = (product: Product) => { setSelectedProduct(product); setDetailOpen(true); };

  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === t.all || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const totalValue = products.reduce((sum, p) => {
    const final = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
    return sum + final;
  }, 0);

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader title={t.inventory.title} subtitle={`${products.length} ${t.inventory.product}`} showBack={false} />

      <main className="container mx-auto px-4 py-6 space-y-5">
        {/* Low stock alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{t.inventory.lowStock}</p>
              <p className="text-xs text-muted-foreground">
                {lowStockProducts.map((p) => `${p.name} (${p.stock ?? 0})`).join("، ")}
              </p>
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Package className="h-3 w-3" /> {t.inventory.products}</span>
              <span className="text-xl font-bold text-foreground block">{products.length}</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><LayoutGrid className="h-3 w-3" /> {t.inventory.categories}</span>
              <span className="text-xl font-bold text-foreground block">{Object.keys(categoryCounts).length}</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><BarChart3 className="h-3 w-3" /> {t.inventory.value}</span>
              <span className="text-lg font-bold text-primary block">{totalValue.toLocaleString("ar-IQ")} <span className="text-[10px]">{t.currency}</span></span>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><List className="h-3 w-3" /> {t.inventory.withDiscount}</span>
              <span className="text-xl font-bold text-accent block">{products.filter((p) => p.discount > 0).length}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button onClick={() => navigate("/add")} className="gap-2"><Plus className="h-4 w-4" />{t.inventory.addProduct}</Button>
          <div className="relative">
            <button onClick={() => setStoreMenuOpen(!storeMenuOpen)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              <Store className="h-4 w-4 text-muted-foreground" />{selectedStore}<ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {storeMenuOpen && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                {stores.map((store) => (
                  <button key={store} onClick={() => { setSelectedStore(store); setStoreMenuOpen(false); }} className={`w-full text-right px-4 py-2 text-sm transition-colors ${selectedStore === store ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"}`}>{store}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.inventory.searchPlaceholder} className="pr-10" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setActiveCategory(t.all)} className={`flex-shrink-0 px-3 py-1 rounded-full text-sm transition-colors ${activeCategory === t.all ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{t.all} ({products.length})</button>
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-shrink-0 px-3 py-1 rounded-full text-sm transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{cat} ({count})</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Package className="h-14 w-14 mb-3 opacity-30" />
            <p className="text-base font-medium">{products.length === 0 ? t.inventory.noProducts : t.noResults}</p>
            <p className="text-sm">{products.length === 0 ? t.inventory.pressToStart : t.inventory.changeCategoryOrSearch}</p>
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
