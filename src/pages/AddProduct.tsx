import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Upload, X } from "lucide-react";
import type { Product } from "@/types/product";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44"];
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
  { name: "رمادي", value: "#6B7280" },
  { name: "كحلي", value: "#1E3A5F" },
];

interface AddProductPageProps {
  categories: string[];
  onAdd: (product: Product) => void;
  onAddCategory: (cat: string) => void;
}

const AddProductPage = ({ categories, onAdd, onAddCategory }: AddProductPageProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customSize, setCustomSize] = useState("");
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

  const addCustomSize = () => {
    const s = customSize.trim();
    if (s && !AVAILABLE_SIZES.includes(s) && !selectedSizes.includes(s)) {
      setSelectedSizes((prev) => [...prev, s]);
      setCustomSize("");
    }
  };

  const handleAddCategory = () => {
    const c = newCategory.trim();
    if (c && !categories.includes(c)) {
      onAddCategory(c);
      setCategory(c);
      setNewCategory("");
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !price) return;
    const product: Product = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      category: category || "أخرى",
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      image,
      sizes: selectedSizes,
      colors: selectedColors,
    };
    onAdd(product);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto max-w-2xl px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowRight className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">إضافة منتج جديد</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-8">
          {/* Image */}
          <div>
            <Label className="text-sm font-medium mb-2 block">صورة المنتج</Label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {image ? (
              <div className="relative w-full h-52 rounded-lg overflow-hidden border border-border">
                <img src={image} alt="معاينة" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage("")}
                  className="absolute top-3 left-3 bg-destructive text-destructive-foreground rounded-full p-1.5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm">اضغط لرفع صورة</span>
              </button>
            )}
          </div>

          {/* Name & Description */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">اسم المنتج *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: قميص رجالي" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">وصف المنتج</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف مختصر للمنتج..."
                rows={3}
              />
            </div>
          </div>

          {/* Category - simplified as text input with suggestions */}
          <div>
            <Label className="text-sm font-medium mb-2 block">الصنف</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="مثال: ملابس رجالية"
              list="categories-list"
            />
            <datalist id="categories-list">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">السعر (د.ع) *</Label>
              <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="25000" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">الخصم (%)</Label>
              <Input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" />
            </div>
          </div>

          {/* Sizes - simplified chips */}
          <div>
            <Label className="text-sm font-medium mb-2 block">الأحجام</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`min-w-[40px] px-2.5 py-1 rounded text-sm transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="حجم مخصص..."
                className="max-w-[180px]"
                onKeyDown={(e) => e.key === "Enter" && addCustomSize()}
              />
              <Button type="button" variant="ghost" size="sm" onClick={addCustomSize} disabled={!customSize.trim()}>
                أضف
              </Button>
            </div>
          </div>

          {/* Colors */}
          <div>
            <Label className="text-sm font-medium mb-2 block">الألوان</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => toggleColor(color.value)}
                  title={color.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColors.includes(color.value)
                      ? "border-primary scale-110 ring-2 ring-primary/30"
                      : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 pb-8">
            <Button onClick={handleSubmit} className="w-full h-12 text-base" disabled={!name.trim() || !price}>
              إضافة المنتج
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProductPage;
