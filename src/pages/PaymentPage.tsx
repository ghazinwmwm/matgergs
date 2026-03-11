import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ShieldCheck, CreditCard, Banknote, Send, CheckCircle2, Store, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface PaymentLink {
  id: string;
  title: string;
  amount: number;
  description: string;
  createdAt: string;
}

const STORAGE_KEY = "matager_payment_links";

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [payMethod, setPayMethod] = useState<"cash" | "card" | "">("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      // Try URL-encoded data first (works across tabs/contexts)
      const encodedData = searchParams.get("d");
      if (encodedData) {
        const decoded: PaymentLink = JSON.parse(decodeURIComponent(atob(encodedData)));
        if (decoded && decoded.id === id) {
          setLink(decoded);
          setLoading(false);
          return;
        }
      }
      // Fallback to localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      const links: PaymentLink[] = saved ? JSON.parse(saved) : [];
      const found = links.find((l) => l.id === id);
      if (found) {
        setLink(found);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  }, [id, searchParams]);

  const handleSubmit = () => {
    if (!payerName.trim() || !payerPhone.trim() || !payMethod) {
      toast({ title: "يرجى تعبئة جميع الحقول", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "✓ تم إرسال طلب الدفع بنجاح" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !link) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center" dir="rtl">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">رابط غير صالح</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          هذا الرابط غير موجود أو تم حذفه. تواصل مع البائع للحصول على رابط جديد.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center" dir="rtl">
        <div className="w-24 h-24 rounded-full bg-[hsl(var(--success))]/10 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <CheckCircle2 className="h-12 w-12 text-[hsl(var(--success))]" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">تم استلام طلبك!</h1>
        <p className="text-sm text-muted-foreground max-w-xs mb-2">
          سيتم التواصل معك قريباً لإتمام عملية الدفع
        </p>
        <div className="bg-card border border-border rounded-2xl p-4 mt-4 w-full max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">الخدمة</span>
            <span className="text-sm font-bold text-foreground">{link.title}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">المبلغ</span>
            <span className="text-sm font-bold text-primary">{link.amount.toLocaleString("ar-IQ")} د.ع</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">طريقة الدفع</span>
            <span className="text-sm font-semibold text-foreground">{payMethod === "cash" ? "نقداً عند الاستلام" : "بطاقة إلكترونية"}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background" dir="rtl">
      {/* Top Banner */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="container mx-auto max-w-lg px-4 py-3 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary">صفحة دفع آمنة</span>
        </div>
      </div>

      <main className="container mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Store Badge */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm">
            <Store className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">متجرك</span>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-card border border-border rounded-3xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-l from-primary/10 to-primary/5 px-6 py-6 text-center space-y-3">
            <h1 className="text-lg font-bold text-foreground">{link.title}</h1>
            {link.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">{link.description}</p>
            )}
            <div className="pt-2">
              <span className="text-3xl font-black text-primary">{link.amount.toLocaleString("ar-IQ")}</span>
              <span className="text-sm font-semibold text-muted-foreground mr-1.5">د.ع</span>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">الاسم الكامل *</label>
              <Input
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className="h-12 rounded-xl bg-muted/30 border-border focus:bg-background"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">رقم الهاتف *</label>
              <Input
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                placeholder="07xxxxxxxxx"
                type="tel"
                inputMode="tel"
                dir="ltr"
                className="h-12 rounded-xl bg-muted/30 border-border focus:bg-background text-left"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">طريقة الدفع *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPayMethod("cash")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    payMethod === "cash"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-muted/20 hover:border-primary/30"
                  }`}
                >
                  <Banknote className={`h-6 w-6 ${payMethod === "cash" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-bold ${payMethod === "cash" ? "text-primary" : "text-foreground"}`}>
                    نقداً
                  </span>
                  <span className="text-[10px] text-muted-foreground">الدفع عند الاستلام</span>
                </button>
                <button
                  onClick={() => setPayMethod("card")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    payMethod === "card"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-muted/20 hover:border-primary/30"
                  }`}
                >
                  <CreditCard className={`h-6 w-6 ${payMethod === "card" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-bold ${payMethod === "card" ? "text-primary" : "text-foreground"}`}>
                    بطاقة
                  </span>
                  <span className="text-[10px] text-muted-foreground">دفع إلكتروني</span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!payerName.trim() || !payerPhone.trim() || !payMethod}
              className="w-full h-13 rounded-2xl gap-2 text-sm font-bold shadow-lg"
              size="lg"
            >
              <Send className="h-4 w-4" />
              تأكيد الدفع — {link.amount.toLocaleString("ar-IQ")} د.ع
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 pb-8">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">تم إنشاء هذا الرابط بتاريخ {link.createdAt}</span>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
