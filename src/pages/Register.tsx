import { useState } from "react";
import logoLight from "@/assets/logo-light.png";
import { useNavigate } from "react-router-dom";
import {
  Store, CreditCard, ChevronLeft, Check,
  Crown, Zap, Truck, Palette, Headphones, Users, Activity, Globe, Shield, Star, Ticket, Sparkles,
  Instagram, Facebook, MessageCircle, Link2, Image, FileText, ShoppingBag, PenTool, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useOnboarding, type BusinessType } from "@/hooks/useOnboarding";
import { useTemplateConfig } from "@/hooks/useTemplateConfig";

const STEPS = [
  { id: 1, label: "المتجر", icon: Palette },
  { id: 2, label: "التواصل", icon: Link2 },
  { id: 3, label: "الباقة", icon: CreditCard },
];

const BUSINESS_TYPES: { id: BusinessType; label: string; desc: string; icon: React.ElementType; emoji: string }[] = [
  { id: "physical", label: "منتجات مادية", desc: "ملابس، إلكترونيات، مواد غذائية...", icon: ShoppingBag, emoji: "📦" },
  { id: "digital", label: "منتجات رقمية", desc: "دورات، كتب، قوالب، ملفات...", icon: Monitor, emoji: "💻" },
  { id: "service", label: "خدمات", desc: "تصميم، برمجة، تصوير، استشارات...", icon: PenTool, emoji: "🎨" },
];

const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourstore", color: "text-pink-500" },
  { id: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourstore", color: "text-blue-500" },
  { id: "tiktok", label: "TikTok", icon: ShoppingBag, placeholder: "https://tiktok.com/@yourstore", color: "text-foreground" },
  { id: "website", label: "موقع إلكتروني", icon: Globe, placeholder: "https://yourwebsite.com", color: "text-primary" },
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
  const { completeOnboarding, setBusinessType: saveBusinessType } = useOnboarding();
  const { resetForBusinessType } = useTemplateConfig();
  const [step, setStep] = useState(0); // 0 = welcome+business type, 1-3 = registration steps

  // Step 1: Business Type
  const [businessType, setBusinessType] = useState<BusinessType>("physical");

  // Step 2: Store Info
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");

  // Step 3: Social Links
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  // Step 4: Plan
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

  const handleNext = () => {
    if (step === 0) {
      // Save business type and configure template defaults on welcome screen
      saveBusinessType(businessType);
      resetForBusinessType(businessType);
      setStep(1);
      return;
    }
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    completeOnboarding();
    toast({ title: "🎉 تم إنشاء متجرك بنجاح!", description: "مرحباً بك في ماتاجر" });
    navigate("/");
  };

  const handleGoogleSignIn = () => {
    toast({ title: "تم تسجيل الدخول بنجاح", description: "مرحباً بك!" });
    setStep(1);
  };

  const basicPrice = billingPeriod === "yearly" ? 12000 : 15000;
  const proPrice = billingPeriod === "yearly" ? 28000 : 35000;

  // Step 0: Welcome / Google Sign-In
  if (step === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6" dir="rtl">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto">
              <img src={logoLight} alt="ماتاجر" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ماتاجر</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              أنشئ متجرك الإلكتروني في دقائق وابدأ البيع فوراً
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Zap, text: "إعداد سريع بخطوات بسيطة" },
              { icon: Globe, text: "نطاق فرعي مجاني .matager.store" },
              { icon: Truck, text: "ربط مع شركات التوصيل" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button onClick={handleGoogleSignIn} className="w-full h-12 rounded-xl text-sm font-bold gap-3" variant="outline">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              المتابعة عبر Google
            </Button>
            <p className="text-[10px] text-muted-foreground">
              بالمتابعة، أنت توافق على <span className="text-primary">شروط الاستخدام</span> و <span className="text-primary">سياسة الخصوصية</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : setStep(0)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <span className="text-sm font-bold text-foreground">إعداد المتجر</span>
          <span className="text-xs text-muted-foreground">{step}/4</span>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-6 pt-5 pb-2">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 right-6 left-6 h-0.5 bg-border" />
          <div className="absolute top-4 right-6 h-0.5 bg-primary transition-all duration-500" style={{ width: `${((step - 1) / 3) * (100 - 12)}%` }} />
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1.5 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                step > s.id ? "bg-success text-success-foreground" :
                step === s.id ? "bg-primary text-primary-foreground scale-110 shadow-md" :
                "bg-card border-2 border-border text-muted-foreground"
              }`}>
                {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-3.5 w-3.5" />}
              </div>
              <span className={`text-[9px] font-medium ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto pb-28">

        {/* Step 1: Business Type */}
        {step === 1 && (
          <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
            <div className="text-center">
              <h2 className="text-lg font-bold text-foreground">شنو نوع نشاطك؟</h2>
              <p className="text-xs text-muted-foreground mt-1">هذا يحدد القالب والإعدادات المناسبة لك</p>
            </div>

            <div className="space-y-3">
              {BUSINESS_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = businessType === type.id;
                return (
                  <button key={type.id} onClick={() => setBusinessType(type.id)}
                    className={`w-full text-right bg-card border-2 rounded-2xl p-5 transition-all ${
                      isSelected ? "border-primary shadow-md" : "border-border hover:border-primary/30"
                    }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors ${
                        isSelected ? "bg-primary/10" : "bg-muted"
                      }`}>
                        {type.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">{type.label}</h3>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{type.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {businessType === "digital" && "ستتمكن من بيع الملفات والدورات عبر رابط تحميل أو بريد إلكتروني."}
                {businessType === "service" && "ستحصل على صفحة هبوط ومعرض أعمال مع إمكانية إنشاء روابط دفع سريعة."}
                {businessType === "physical" && "ستتمكن من إضافة منتجاتك وإدارة الطلبات والتوصيل بسهولة."}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Store Info */}
        {step === 2 && (
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
                        <span className="text-[9px] text-muted-foreground">شعار</span>
                      </div>
                    )}
                  </div>
                </label>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">اسم المتجر *</label>
                <Input value={storeName} onChange={(e) => {
                  setStoreName(e.target.value);
                  setStoreSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
                }} placeholder={businessType === "service" ? "مثال: استوديو الإبداع" : "مثال: متجر الأناقة"} className="h-11" />
              </div>

              {storeName && (
                <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground" dir="ltr">{storeSlug || "your-store"}.matager.store</span>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  <Globe className="h-3.5 w-3.5 inline-block ml-1" /> نطاق المتجر *
                </label>
                <div className="flex items-center gap-0 border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                  <span className="text-[11px] text-muted-foreground bg-secondary px-3 py-2.5 border-l border-input whitespace-nowrap" dir="ltr">.matager.store</span>
                  <input value={storeSlug} onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-store" className="flex-1 h-11 px-3 text-xs bg-background text-foreground placeholder:text-muted-foreground outline-none" dir="ltr" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  <MessageCircle className="h-3.5 w-3.5 inline-block ml-1 text-green-500" /> رقم الواتساب *
                </label>
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="07XX XXX XXXX" className="h-11 text-xs" dir="ltr" type="tel" />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  <FileText className="h-3.5 w-3.5 inline-block ml-1" /> وصف المتجر
                </label>
                <Textarea value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder={businessType === "service" ? "اكتب وصفاً عن خدماتك..." : "اكتب وصفاً عن متجرك..."}
                  className="min-h-[80px] resize-none text-sm" maxLength={200} />
                <p className="text-[10px] text-muted-foreground mt-1 text-left" dir="ltr">{storeDescription.length}/200</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Social Links */}
        {step === 3 && (
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
                    <Input value={socialLinks[platform.id] || ""} onChange={(e) => updateSocialLink(platform.id, e.target.value)}
                      placeholder={platform.placeholder} className="h-10 text-xs" dir="ltr" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Plan Selection */}
        {step === 4 && (
          <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
            <div>
              <h2 className="text-lg font-bold text-foreground">اختر باقتك</h2>
              <p className="text-xs text-muted-foreground mt-0.5">يمكنك تغيير الباقة لاحقاً</p>
            </div>

            <div className="flex items-center justify-center gap-1 bg-secondary rounded-xl p-1">
              <button onClick={() => setBillingPeriod("monthly")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${billingPeriod === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                شهري
              </button>
              <button onClick={() => setBillingPeriod("yearly")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${billingPeriod === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                سنوي <span className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-bold">-20%</span>
              </button>
            </div>

            <div className="space-y-3">
              <button onClick={() => setSelectedPlan("basic")}
                className={`w-full text-right bg-card border-2 rounded-2xl p-4 transition-all ${selectedPlan === "basic" ? "border-primary shadow-sm" : "border-border"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === "basic" ? "border-primary" : "border-muted-foreground/30"}`}>
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

              <button onClick={() => setSelectedPlan("pro")}
                className={`w-full text-right bg-card border-2 rounded-2xl overflow-hidden transition-all ${selectedPlan === "pro" ? "border-primary shadow-sm" : "border-border"}`}>
                <div className="bg-primary text-primary-foreground text-[10px] font-bold text-center py-1">⭐ الأكثر شعبية</div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === "pro" ? "border-primary" : "border-muted-foreground/30"}`}>
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

            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold text-foreground">ميزات الباقة {selectedPlan === "basic" ? "الأساسية" : "الاحترافية"}</h4>
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
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border p-4">
        <Button onClick={handleNext} className="w-full h-12 rounded-xl text-sm font-bold gap-2">
          {step === 4 ? (
            <><Sparkles className="h-4 w-4" /> إنشاء المتجر - {selectedPlan === "basic" ? basicPrice.toLocaleString("ar-IQ") : proPrice.toLocaleString("ar-IQ")} د.ع/شهر</>
          ) : (
            "التالي"
          )}
        </Button>
        {step === 3 && (
          <button onClick={() => setStep(4)} className="w-full text-center mt-2">
            <span className="text-[11px] text-muted-foreground">تخطي هذه الخطوة</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Register;
