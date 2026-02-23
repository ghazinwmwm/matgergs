import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [customColor, setCustomColor] = useState("#000000");
  const [customColorName, setCustomColorName] = useState("");
  const [extraColors, setExtraColors] = useState<{ name: string; value: string }[]>([]);
  const [extraSizes, setExtraSizes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allSizes = [...AVAILABLE_SIZES, ...extraSizes];
  const allColors = [...AVAILABLE_COLORS, ...extraColors];

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
    if (s && !allSizes.includes(s)) {
      setExtraSizes((prev) => [...prev, s]);
      setSelectedSizes((prev) => [...prev, s]);
      setCustomSize("");
    }
  };

  const addCustomColor = () => {
    const n = customColorName.trim();
    if (n && customColor) {
      setExtraColors((prev) => [...prev, { name: n, value: customColor }]);
      setSelectedColors((prev) => [...prev, customColor]);
      setCustomColorName("");
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
        <div className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label>اسم المنتج *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: قميص رجالي" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>وصف المنتج</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف تفصيلي للمنتج..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>الصنف</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="اختر صنف" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="أضف صنف جديد..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddCategory} disabled={!newCategory.trim()}>
                أضف
              </Button>
            </div>
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>السعر (د.ع) *</Label>
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
              {allSizes.map((size) => (
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
            <div className="flex gap-2">
              <Input
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="حجم مخصص..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && addCustomSize()}
              />
              <Button type="button" variant="outline" size="sm" onClick={addCustomSize} disabled={!customSize.trim()}>
                أضف
              </Button>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>الألوان</Label>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => (
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
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-9 h-9 rounded border border-border cursor-pointer"
              />
              <Input
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
                placeholder="اسم اللون..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && addCustomColor()}
              />
              <Button type="button" variant="outline" size="sm" onClick={addCustomColor} disabled={!customColorName.trim()}>
                أضف
              </Button>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={!name.trim() || !price}>
            إضافة المنتج
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AddProductPage;
