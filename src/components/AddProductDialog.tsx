import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, X } from "lucide-react";
import type { Product } from "@/types/product";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const AVAILABLE_COLORS = [
  { name: "أسود", value: "#000000" },
  { name: "أبيض", value: "#FFFFFF" },
  { name: "أحمر", value: "#EF4444" },
  { name: "أزرق", value: "#3B82F6" },
  { name: "أخضر", value: "#22C55E" },
  { name: "أصفر", value: "#EAB308" },
  { name: "برتقالي", value: "#F97316" },
  { name: "وردي", value: "#EC4899" },
  { name: "بنفسجي", value: "#8B5CF6" },
  { name: "بني", value: "#92400E" },
];

interface AddProductDialogProps {
  onAdd: (product: Product) => void;
}

const AddProductDialog = ({ onAdd }: AddProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !price) return;
    const product: Product = {
      id: crypto.randomUUID(),
      name: name.trim(),
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      image,
      sizes: selectedSizes,
      colors: selectedColors,
    };
    onAdd(product);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDiscount("");
    setImage("");
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة منتج
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">إضافة منتج جديد</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label>اسم المنتج</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: قميص رجالي" />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>السعر (د.ع)</Label>
              <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="25000" />
            </div>
            <div className="space-y-2">
              <Label>الخصم (%)</Label>
              <Input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" />
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>صورة المنتج</Label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {image ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                <img src={image} alt="معاينة" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage("")}
                  className="absolute top-2 left-2 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm">اضغط لرفع صورة</span>
              </button>
            )}
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>الأحجام</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>الألوان</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => toggleColor(color.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors ${
                    selectedColors.includes(color.value)
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={!name.trim() || !price}>
            إضافة المنتج
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
