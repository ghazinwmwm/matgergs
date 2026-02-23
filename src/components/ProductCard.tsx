import { Trash2, Package, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

const COLORS_MAP: Record<string, string> = {
  "#000000": "أسود",
  "#FFFFFF": "أبيض",
  "#EF4444": "أحمر",
  "#3B82F6": "أزرق",
  "#22C55E": "أخضر",
  "#EAB308": "أصفر",
  "#F97316": "برتقالي",
  "#EC4899": "وردي",
  "#8B5CF6": "بنفسجي",
  "#92400E": "بني",
  "#6B7280": "رمادي",
  "#1E3A5F": "كحلي",
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
    <div className="bg-card rounded-lg border border-border overflow-hidden animate-slide-in hover:shadow-lg transition-shadow group">
      {/* Image */}
      <div className="relative h-48 bg-muted cursor-pointer" onClick={() => onView(product)}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Package className="h-12 w-12" />
          </div>
        )}
        {product.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            -{product.discount}%
          </Badge>
        )}
        <Badge variant="secondary" className="absolute bottom-2 right-2 text-xs">
          {product.category}
        </Badge>
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onView(product); }}
            className="p-2 rounded-full bg-card/90 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
            className="p-2 rounded-full bg-card/90 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-card-foreground truncate">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {finalPrice.toLocaleString("ar-IQ")} د.ع
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {product.price.toLocaleString("ar-IQ")}
            </span>
          )}
        </div>

        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              <span key={size} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                {size}
              </span>
            ))}
          </div>
        )}

        {product.colors.length > 0 && (
          <div className="flex gap-1.5">
            {product.colors.map((color) => (
              <span
                key={color}
                title={COLORS_MAP[color] || color}
                className="w-5 h-5 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
