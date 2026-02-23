import { Trash2, Package, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

const COLORS_MAP: Record<string, string> = {
  "#000000": "أسود", "#FFFFFF": "أبيض", "#EF4444": "أحمر", "#3B82F6": "أزرق",
  "#22C55E": "أخضر", "#EAB308": "أصفر", "#F97316": "برتقالي", "#EC4899": "وردي",
  "#8B5CF6": "بنفسجي", "#92400E": "بني", "#6B7280": "رمادي", "#1E3A5F": "كحلي",
};

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
}

const ProductCard = ({ product, onDelete, onView }: ProductCardProps) => {
  const finalPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div
      onClick={() => onView(product)}
      className="bg-card rounded-lg border border-border overflow-hidden animate-slide-in hover:shadow-md transition-shadow cursor-pointer flex flex-row h-24"
    >
      {/* Image */}
      <div className="relative w-24 h-full flex-shrink-0 bg-muted">
        {product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Package className="h-6 w-6" />
          </div>
        )}
        {product.discount > 0 && (
          <span className="absolute top-1 right-1 text-[10px] font-bold bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-card-foreground truncate">{product.name}</h3>
            <span className="text-[11px] text-muted-foreground">{product.category}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
            className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-primary">
            {finalPrice.toLocaleString("ar-IQ")} د.ع
          </span>
          {product.discount > 0 && (
            <span className="text-[11px] text-muted-foreground line-through">
              {product.price.toLocaleString("ar-IQ")}
            </span>
          )}
          {product.colors.length > 0 && (
            <div className="flex gap-0.5 mr-auto">
              {product.colors.slice(0, 4).map((color) => (
                <span key={color} className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: color }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
