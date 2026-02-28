import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Store, CreditCard, ChevronLeft, Check, Eye, EyeOff,
  Crown, Zap, Truck, Palette, Headphones, Users, Activity, Globe, Shield, Star, Ticket, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const STEPS = [
  { id: 1, label: "الحساب", icon: User },
  { id: 2, label: "المتجر", icon: Store },
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

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Store
  const [storeName, setStoreName] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [storeSlug, setStoreSlug] = useState("");

  // Step 3: Plan
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro">("basic");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const canNext = () => {
    if (step === 1) return name.trim() && email.trim() && password.length >= 6;
    if (step === 2) return storeName.trim() && storeCategory;
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronLeft className="h-5 w-5 text-foreground rotate-180" />
          </button>
          <span className="text-sm font-bold text-foreground">إنشاء حساب</span>
          <span className="text-xs text-muted-foreground">{step}/3</span>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-6 pt-5 pb-2">
        <div className="flex items-center justify-between relative">
          {/* Line behind */}
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
      <div className="flex-1 container mx-auto px-4 py-6">
        {/* Step 1: Account Info */}
        {step === 1 && (
          <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
            <div>
              <h2 className="text-lg font-bold text-foreground">معلومات الحساب</h2>
              <p className="text-xs text-muted-foreground mt-0.5">أدخل بياناتك الشخصية للبدء</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">الاسم الكامل *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: أحمد محمد" className="h-11" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">البريد الإلكتروني *</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ahmed@example.com" className="h-11" dir="ltr" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">رقم الهاتف</label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XX XXX XXXX" className="h-11" dir="ltr" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">كلمة المرور *</label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="6 أحرف على الأقل" 
                    className="h-11 pl-10" 
                    dir="ltr" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password.length > 0 && password.length < 6 && (
                  <p className="text-[10px] text-destructive mt-1">كلمة المرور يجب أن تكون 6 أحرف على الأقل</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Store Info */}
        {step === 2 && (
          <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
            <div>
              <h2 className="text-lg font-bold text-foreground">معلومات المتجر</h2>
              <p className="text-xs text-muted-foreground mt-0.5">أخبرنا عن متجرك</p>
            </div>

            <div className="space-y-3.5">
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

              {storeName && (
                <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground" dir="ltr">
                    {storeSlug || "your-store"}.matager.store
                  </span>
                </div>
              )}

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
                {(selectedPlan === "basic" ? BASIC_FEATURES : PRO_FEATURES).map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.text} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <span className="text-xs text-foreground">{f.text}</span>
                    </div>
                  );
                })}
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
          ) : (
            "التالي"
          )}
        </Button>
        {step === 1 && (
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            لديك حساب؟ <button onClick={() => navigate("/")} className="text-primary font-bold">تسجيل الدخول</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
