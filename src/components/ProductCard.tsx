import { Trash2, Package } from "lucide-react";
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
};

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  const finalPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden animate-slide-in hover:shadow-lg transition-shadow group">
      {/* Image */}
      <div className="relative h-48 bg-muted">
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
        <button
          onClick={() => onDelete(product.id)}
          className="absolute top-2 left-2 p-2 rounded-full bg-card/80 backdrop-blur-sm text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-card-foreground truncate">{product.name}</h3>

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
