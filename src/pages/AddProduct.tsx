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
import { ArrowRight, Upload, X, ChevronDown, ChevronUp, Plus, Package, FileText, Monitor, Download, Link2, Clock, Layers, File } from "lucide-react";
import type { Product } from "@/types/product";


const EXAMPLE_SIZES = ["S", "M", "L", "XL"];
const EXAMPLE_COLORS = [
  { name: "أسود", value: "#000000" },
  { name: "أبيض", value: "#FFFFFF" },
  { name: "أزرق", value: "#3B82F6" },
  { name: "أحمر", value: "#EF4444" },
];

const RETURN_POLICIES = [
  { label: "لا يوجد استرجاع", value: "no-return" },
  { label: "استرجاع خلال 3 أيام", value: "3-days" },
  { label: "استرجاع خلال 7 أيام", value: "7-days" },
  { label: "استرجاع خلال 14 يوم", value: "14-days" },
  { label: "استرجاع خلال 30 يوم", value: "30-days" },
];

const DIGITAL_CATEGORIES = [
  { label: "دورة تعليمية", value: "دورات", icon: Monitor },
  { label: "كتاب إلكتروني", value: "كتب", icon: FileText },
  { label: "قالب / تصميم", value: "قوالب", icon: Layers },
  { label: "ملف رقمي آخر", value: "ملفات رقمية", icon: Download },
];

const FILE_TYPES = [
  { label: "PDF", value: "pdf" },
  { label: "فيديو (MP4)", value: "video" },
  { label: "صورة (PSD/AI/SVG)", value: "image" },
  { label: "ملف مضغوط (ZIP)", value: "zip" },
  { label: "رابط خارجي", value: "link" },
];

interface AddProductPageProps {
  categories: string[];
  onAdd: (product: Product) => void;
  onAddCategory: (cat: string) => void;
}

type ProductType = "physical" | "digital";

const AddProductPage = ({ categories, onAdd, onAddCategory }: AddProductPageProps) => {
  const navigate = useNavigate();
  const [productType, setProductType] = useState<ProductType>("physical");
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [digitalCategory, setDigitalCategory] = useState("");
  const [fileType, setFileType] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [lessonCount, setLessonCount] = useState("");
  const [duration, setDuration] = useState("");
  const [digitalFile, setDigitalFile] = useState<{ name: string; size: number; dataUrl: string } | null>(null);

  const digitalFileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("#000000");
  const [customColorName, setCustomColorName] = useState("");
  const [extraColors, setExtraColors] = useState<{ name: string; value: string }[]>([]);
  const [extraSizes, setExtraSizes] = useState<string[]>([]);
  const [returnPolicy, setReturnPolicy] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [stock, setStock] = useState("");

  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const filteredCategories = category.trim()
    ? categories.filter((c) => c.includes(category) && c !== category)
    : [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const allSizes = [...EXAMPLE_SIZES, ...extraSizes];
  const allColors = [...EXAMPLE_COLORS, ...extraColors];

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  const toggleColor = (color: string) =>
    setSelectedColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const addCustomSize = () => {
    const s = customSize.trim();
    if (s && !allSizes.includes(s)) { setExtraSizes(prev => [...prev, s]); setSelectedSizes(prev => [...prev, s]); setCustomSize(""); }
  };
  const addCustomColor = () => {
    const n = customColorName.trim();
    if (n && customColor) { setExtraColors(prev => [...prev, { name: n, value: customColor }]); setSelectedColors(prev => [...prev, customColor]); setCustomColorName(""); }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val); setShowCategorySuggestions(true);
    if (val.trim() && !categories.includes(val.trim())) onAddCategory(val.trim());
  };

  const handleSubmit = () => {
    if (!name.trim() || !price) return;
    const finalCategory = productType === "digital" ? (digitalCategory || "ملفات رقمية") : (category.trim() || "أخرى");
    const product: Product = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      category: finalCategory,
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      images,
      sizes: productType === "physical" ? selectedSizes : [],
      colors: productType === "physical" ? selectedColors : [],
      returnPolicy: productType === "physical" ? (returnPolicy || "") : "no-return",
      deliveryDays: productType === "physical" && deliveryDays ? parseInt(deliveryDays) : null,
      stock: productType === "physical" && stock ? parseInt(stock) : undefined,
    };
    onAdd(product);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto max-w-2xl px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowRight className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground flex-1">إضافة منتج جديد</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-6">

          {/* ═══ INLINE TYPE TOGGLE ═══ */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setProductType("physical")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                productType === "physical" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Package className="h-3.5 w-3.5" /> منتج فيزيائي
            </button>
            <button
              onClick={() => setProductType("digital")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                productType === "digital" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" /> منتج رقمي
            </button>
          </div>

          {/* ═══ BASIC DETAILS ═══ */}
          <section className="space-y-5">
            <h2 className="text-sm font-semibold text-muted-foreground tracking-wide">التفاصيل الأساسية</h2>

            {/* Images */}
            <div className="space-y-2">
              <Label>{productType === "digital" ? "صورة الغلاف" : "صور المنتج"}</Label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple={productType === "physical"} className="hidden" onChange={handleImageUpload} />
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                    <img src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 left-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload className="h-5 w-5" />
                  <span className="text-[10px]">{productType === "digital" ? "غلاف" : "رفع صورة"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>اسم المنتج *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={productType === "digital" ? "مثال: دورة تصميم UI/UX" : "مثال: قميص رجالي"} />
            </div>

            <div className="space-y-2">
              <Label>وصف المنتج</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={productType === "digital" ? "وصف المنتج الرقمي..." : "وصف مختصر..."} rows={3} />
            </div>

            {/* Category */}
            {productType === "digital" ? (
              <div className="space-y-2">
                <Label>نوع المنتج الرقمي</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DIGITAL_CATEGORIES.map(cat => (
                    <button key={cat.value} onClick={() => setDigitalCategory(cat.value)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-right transition-all ${
                        digitalCategory === cat.value ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/30"
                      }`}>
                      <cat.icon className={`h-4 w-4 flex-shrink-0 ${digitalCategory === cat.value ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-medium ${digitalCategory === cat.value ? "text-primary" : "text-foreground"}`}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2 relative">
                <Label>الصنف</Label>
                <Input value={category} onChange={(e) => handleCategoryChange(e.target.value)}
                  onFocus={() => setShowCategorySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 150)}
                  placeholder="اكتب اسم الصنف..." />
                {showCategorySuggestions && filteredCategories.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-card border border-border rounded-lg shadow-lg py-1 max-h-40 overflow-y-auto">
                    {filteredCategories.map((cat) => (
                      <button key={cat} onMouseDown={() => { setCategory(cat); setShowCategorySuggestions(false); }}
                        className="w-full text-right px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">{cat}</button>
                    ))}
                  </div>
                )}
              </div>
            )}

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
          </section>

          {/* ═══ DIGITAL FIELDS ═══ */}
          {productType === "digital" && (
            <section className="space-y-5">
              <h2 className="text-sm font-semibold text-muted-foreground tracking-wide">تفاصيل المنتج الرقمي</h2>
              <div className="space-y-2">
                <Label>نوع الملف</Label>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger><SelectValue placeholder="اختر نوع الملف" /></SelectTrigger>
                  <SelectContent>{FILE_TYPES.map(ft => <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5 text-muted-foreground" /> رابط التحميل / الوصول</Label>
                <Input value={downloadLink} onChange={(e) => setDownloadLink(e.target.value)} placeholder="https://..." dir="ltr" />
                <p className="text-[10px] text-muted-foreground">سيتم إرسال الرابط للعميل بعد الشراء</p>
              </div>
              {digitalCategory === "دورات" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-muted-foreground" /> عدد الدروس</Label>
                    <Input type="number" min="1" value={lessonCount} onChange={(e) => setLessonCount(e.target.value)} placeholder="45" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> المدة (بالساعات)</Label>
                    <Input type="number" min="0" step="0.5" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="12" />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ═══ PHYSICAL ADVANCED ═══ */}
          {productType === "physical" && (
            <section>
              <button onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between py-3 border-t border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <span>التفاصيل المتقدمة (اختياري)</span>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showAdvanced && (
                <div className="space-y-5 pt-2">
                  <div className="space-y-2">
                    <Label className="text-sm">المخزون</Label>
                    <Input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="عدد القطع المتوفرة" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">الأحجام</Label>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map(size => (
                        <button key={size} onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                            selectedSizes.includes(size) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                          }`}>{size}</button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={customSize} onChange={(e) => setCustomSize(e.target.value)} placeholder="حجم مخصص..." className="flex-1 max-w-[180px]" onKeyDown={(e) => e.key === "Enter" && addCustomSize()} />
                      <Button type="button" variant="outline" size="sm" onClick={addCustomSize} disabled={!customSize.trim()}>أضف</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">الألوان</Label>
                    <div className="flex flex-wrap gap-2">
                      {allColors.map(color => (
                        <button key={color.value} onClick={() => toggleColor(color.value)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors ${
                            selectedColors.includes(color.value) ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary"
                          }`}>
                          <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color.value }} />
                          {color.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-9 h-9 rounded border border-border cursor-pointer" />
                      <Input value={customColorName} onChange={(e) => setCustomColorName(e.target.value)} placeholder="اسم اللون..." className="flex-1" onKeyDown={(e) => e.key === "Enter" && addCustomColor()} />
                      <Button type="button" variant="outline" size="sm" onClick={addCustomColor} disabled={!customColorName.trim()}>أضف</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">سياسة الاسترجاع</Label>
                    <Select value={returnPolicy} onValueChange={setReturnPolicy}>
                      <SelectTrigger><SelectValue placeholder="اختر سياسة الاسترجاع" /></SelectTrigger>
                      <SelectContent>{RETURN_POLICIES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">مدة التوصيل (بالأيام)</Label>
                    <Input type="number" min="0" value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} placeholder="مثال: 3" />
                  </div>
                </div>
              )}
            </section>
          )}

          <div className="pt-2 pb-8">
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
