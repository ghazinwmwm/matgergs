import { useState } from "react";
import { Package } from "lucide-react";
import AddProductDialog from "@/components/AddProductDialog";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

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
          <AddProductDialog onAdd={addProduct} />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Package className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">لا توجد منتجات بعد</p>
            <p className="text-sm">اضغط على "إضافة منتج" للبدء</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onDelete={deleteProduct} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
