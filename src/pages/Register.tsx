import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Store, CreditCard, ChevronLeft, Check, 
  Crown, Zap, Truck, Palette, Headphones, Users, Activity, Globe, Shield, Star, Ticket, Sparkles,
  Instagram, Facebook, MessageCircle, Link2, Image, FileText, ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const STEPS = [
  { id: 1, label: "المتجر", icon: Store },
  { id: 2, label: "التواصل", icon: Link2 },
  { id: 3, label: "الباقة", icon: CreditCard },
];

const STORE_CATEGORIES = [
  "ملابس وأزياء", "إلكترونيات", "مواد غذائية", "مستحضرات تجميل",
  "أحذية وحقائب", "أثاث ومفروشات", "هدايا وتحف", "أخرى"
];

const BASIC_FEATURES = [
  { text: "متجر واحد", icon: Store },
  { text: "50 منتج كحد أقصى", icon: Zap },
  { text: "أكواد خصم غير محدودة", icon: Ticket },
  { text: "شركة توصيل واحدة", icon: Truck },
  { text: "قالب مجاني واحد", icon: Palette },
  { text: "دعم عبر البريد", icon: Headphones },
];

const PRO_FEATURES = [
  { text: "متاجر غير محدودة", icon: Store },
  { text: "منتجات غير محدودة", icon: Zap },
  { text: "أكواد خصم غير محدودة", icon: Ticket },
  { text: "جميع شركات التوصيل", icon: Truck },
  { text: "جميع القوالب المميزة", icon: Crown },
  { text: "دعم أولوية 24/7", icon: Headphones },
  { text: "حتى 5 مديرين", icon: Users },
  { text: "بيكسل + Google Analytics", icon: Activity },
  { text: "دومين مخصص", icon: Globe },
  { text: "تقارير متقدمة", icon: Star },
  { text: "حماية SSL مجانية", icon: Shield },
];

const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourstore", color: "text-pink-500" },
  { id: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourstore", color: "text-blue-500" },
  { id: "tiktok", label: "TikTok", icon: ShoppingBag, placeholder: "https://tiktok.com/@yourstore", color: "text-foreground" },
  { id: "website", label: "موقع إلكتروني", icon: Globe, placeholder: "https://yourwebsite.com", color: "text-primary" },
];

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Store Info
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Step 2: Social Links
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  // Step 3: Plan
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro">("basic");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setStoreLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateSocialLink = (id: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [id]: value }));
  };

  const canNext = () => {
    return true;
  };

  const handleNext = () => {
    if (!canNext()) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    toast({ title: "🎉 تم إنشاء متجرك بنجاح!", description: "مرحباً بك في ماتاجر" });
    navigate("/");
  };

  const basicPrice = billingPeriod === "yearly" ? 12000 : 15000;
  const proPrice = billingPeriod === "yearly" ? 28000 : 35000;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <span className="text-sm font-bold text-foreground">إكمال إعداد المتجر</span>
          <span className="text-xs text-muted-foreground">{step}/3</span>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-6 pt-5 pb-2">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 right-8 left-8 h-0.5 bg-border" />
          <div className="absolute top-4 right-8 h-0.5 bg-primary transition-all duration-500" style={{ width: `${((step - 1) / 2) * (100 - 20)}%` }} />
          
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1.5 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                step > s.id ? "bg-success text-success-foreground" : 
                step === s.id ? "bg-primary text-primary-foreground scale-110 shadow-md" : 
                "bg-card border-2 border-border text-muted-foreground"
              }`}>
                {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-3.5 w-3.5" />}
              </div>
              <span className={`text-[10px] font-medium ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto pb-28">

        {/* Step 1: Store Info */}
        {step === 1 && (
          <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
            <div>
              <h2 className="text-lg font-bold text-foreground">معلومات المتجر</h2>
              <p className="text-xs text-muted-foreground mt-0.5">أخبرنا عن متجرك لنبدأ</p>
            </div>

            <div className="space-y-4">
              {/* Store Logo */}
              <div className="flex flex-col items-center gap-3">
                <label htmlFor="logo-upload" className="cursor-pointer group">
                  <div className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all overflow-hidden ${
                    storeLogo ? "border-primary" : "border-border group-hover:border-primary/50"
                  }`}>
                    {storeLogo ? (
                      <img src={storeLogo} alt="شعار المتجر" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Image className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[9px] text-muted-foreground">شعار المتجر</span>
                      </div>
                    )}
                  </div>
                </label>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                <p className="text-[10px] text-muted-foreground">اختياري • PNG أو JPG</p>
              </div>

              {/* Store Name */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">اسم المتجر *</label>
                <Input 
                  value={storeName} 
                  onChange={(e) => {
                    setStoreName(e.target.value);
                    setStoreSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
                  }} 
                  placeholder="مثال: متجر الأناقة" 
                  className="h-11" 
                />
              </div>

              {/* Store URL Preview */}
              {storeName && (
                <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground" dir="ltr">
                    {storeSlug || "your-store"}.matager.store
                  </span>
                </div>
              )}

              {/* Store Subdomain */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  <Globe className="h-3.5 w-3.5 inline-block ml-1" />
                  نطاق المتجر *
                </label>
                <div className="flex items-center gap-0 border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <span className="text-[11px] text-muted-foreground bg-secondary px-3 py-2.5 border-l border-input whitespace-nowrap" dir="ltr">.matager.store</span>
                  <input
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-store"
                    className="flex-1 h-11 px-3 text-xs bg-background text-foreground placeholder:text-muted-foreground outline-none"
                    dir="ltr"
                  />
                </div>
                {storeSlug && (
                  <p className="text-[10px] text-muted-foreground mt-1.5" dir="ltr">
                    {storeSlug}.matager.store
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  <MessageCircle className="h-3.5 w-3.5 inline-block ml-1 text-green-500" />
                  رقم الواتساب *
                </label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="07XX XXX XXXX"
                  className="h-11 text-xs"
                  dir="ltr"
                  type="tel"
                />
              </div>


              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  <FileText className="h-3.5 w-3.5 inline-block ml-1" />
                  وصف المتجر
                </label>
                <Textarea
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="اكتب وصفاً مختصراً عن متجرك ونوع المنتجات التي تبيعها..."
                  className="min-h-[80px] resize-none text-sm"
                  maxLength={200}
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-left" dir="ltr">{storeDescription.length}/200</p>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">تصنيف المتجر *</label>
                <div className="grid grid-cols-2 gap-2">
                  {STORE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setStoreCategory(cat)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        storeCategory === cat 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border bg-card text-foreground hover:border-primary/30"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Social Links */}
        {step === 2 && (
          <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
            <div>
              <h2 className="text-lg font-bold text-foreground">روابط التواصل الاجتماعي</h2>
              <p className="text-xs text-muted-foreground mt-0.5">أضف حساباتك ليتمكن عملاؤك من التواصل معك <span className="text-muted-foreground/60">(اختياري)</span></p>
            </div>

            <div className="space-y-3">
              {SOCIAL_PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.id} className="bg-card border border-border rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${platform.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">{platform.label}</span>
                    </div>
                    <Input
                      value={socialLinks[platform.id] || ""}
                      onChange={(e) => updateSocialLink(platform.id, e.target.value)}
                      placeholder={platform.placeholder}
                      className="h-10 text-xs"
                      dir="ltr"
                    />
                  </div>
                );
              })}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                يمكنك تعديل هذه الروابط لاحقاً من إعدادات المتجر. ستظهر هذه الروابط في صفحة متجرك للعملاء.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Plan Selection */}
        {step === 3 && (
          <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
            <div>
              <h2 className="text-lg font-bold text-foreground">اختر باقتك</h2>
              <p className="text-xs text-muted-foreground mt-0.5">يمكنك تغيير الباقة لاحقاً في أي وقت</p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-1 bg-secondary rounded-xl p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  billingPeriod === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                شهري
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                  billingPeriod === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                سنوي
                <span className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-bold">-20%</span>
              </button>
            </div>

            {/* Plans */}
            <div className="space-y-3">
              {/* Basic Plan */}
              <button
                onClick={() => setSelectedPlan("basic")}
                className={`w-full text-right bg-card border-2 rounded-2xl p-4 transition-all ${
                  selectedPlan === "basic" ? "border-primary shadow-sm" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === "basic" ? "border-primary" : "border-muted-foreground/30"
                    }`}>
                      {selectedPlan === "basic" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm font-bold text-foreground">الأساسية</span>
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold text-foreground">{basicPrice.toLocaleString("ar-IQ")}</span>
                    <span className="text-[10px] text-muted-foreground mr-1">د.ع/شهر</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">مثالية للبدء • متجر واحد • 50 منتج</p>
              </button>

              {/* Pro Plan */}
              <button
                onClick={() => setSelectedPlan("pro")}
                className={`w-full text-right bg-card border-2 rounded-2xl overflow-hidden transition-all ${
                  selectedPlan === "pro" ? "border-primary shadow-sm" : "border-border"
                }`}
              >
                <div className="bg-primary text-primary-foreground text-[10px] font-bold text-center py-1">
                  ⭐ الأكثر شعبية
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === "pro" ? "border-primary" : "border-muted-foreground/30"
                      }`}>
                        {selectedPlan === "pro" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm font-bold text-foreground">الاحترافية</span>
                      <Crown className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-bold text-foreground">{proPrice.toLocaleString("ar-IQ")}</span>
                      <span className="text-[10px] text-muted-foreground mr-1">د.ع/شهر</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">كل شيء غير محدود • فريق عمل • تحليلات</p>
                </div>
              </button>
            </div>

            {/* Selected Plan Features */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold text-foreground">
                  ميزات الباقة {selectedPlan === "basic" ? "الأساسية" : "الاحترافية"}
                </h4>
              </div>
              <div className="space-y-2.5">
                {(selectedPlan === "basic" ? BASIC_FEATURES : PRO_FEATURES).map((f) => (
                  <div key={f.text} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-xs text-foreground">{f.text}</span>
                  </div>
                ))}
              </div>

              {selectedPlan === "basic" && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] text-muted-foreground text-center">
                    تحتاج ميزات أكثر؟ <button onClick={() => setSelectedPlan("pro")} className="text-primary font-bold">جرّب الاحترافية</button>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border p-4">
        <Button onClick={handleNext} className="w-full h-12 rounded-xl text-sm font-bold gap-2" disabled={!canNext()}>
          {step === 3 ? (
            <>
              <Sparkles className="h-4 w-4" />
              إنشاء المتجر - {selectedPlan === "basic" ? basicPrice.toLocaleString("ar-IQ") : proPrice.toLocaleString("ar-IQ")} د.ع/شهر
            </>
          ) : step === 2 ? (
            "التالي"
          ) : (
            "التالي"
          )}
        </Button>
        {step === 2 && (
          <button onClick={() => { setStep(3); }} className="w-full text-center mt-2">
            <span className="text-[11px] text-muted-foreground">تخطي هذه الخطوة</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Register;
