import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
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

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailDialog = ({ product, open, onOpenChange }: ProductDetailDialogProps) => {
  if (!product) return null;

  const finalPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">تفاصيل المنتج</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="w-full h-56 rounded-lg overflow-hidden bg-muted">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Package className="h-16 w-16" />
              </div>
            )}
          </div>

          {/* Name & Category */}
          <div>
            <h2 className="text-lg font-bold text-foreground">{product.name}</h2>
            <Badge variant="secondary" className="mt-1">{product.category}</Badge>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">الوصف</h4>
              <p className="text-sm text-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <div>
              <span className="text-sm text-muted-foreground">السعر</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">
                  {finalPrice.toLocaleString("ar-IQ")} د.ع
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      {product.price.toLocaleString("ar-IQ")}
                    </span>
                    <Badge className="bg-destructive text-destructive-foreground text-xs">
                      -{product.discount}%
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">الأحجام المتوفرة</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span key={size} className="px-3 py-1 rounded-md text-sm bg-secondary text-secondary-foreground border border-border">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">الألوان المتوفرة</h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div key={color} className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border">
                    <span
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm">{COLORS_MAP[color] || color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
