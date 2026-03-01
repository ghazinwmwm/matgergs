import { useState } from "react";
import { Crown, Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/hooks/usePlan";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProGateProps {
  children: React.ReactNode;
  feature?: string;
  /** Minimum plan required. Defaults to "pro" */
  minPlan?: "basic" | "pro";
}

/** Wraps content that requires a paid plan. Shows upgrade popup for lower-tier users. */
export const ProGate = ({ children, feature, minPlan = "pro" }: ProGateProps) => {
  const { plan } = usePlan();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const hasAccess = minPlan === "basic" 
    ? (plan === "basic" || plan === "pro") 
    : plan === "pro";

  if (hasAccess) return <>{children}</>;

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
        <div className="pointer-events-none opacity-50 blur-[1px] select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[2px] rounded-xl">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-bold text-foreground flex items-center gap-1">
              <Crown className="h-3 w-3 text-primary" />
              {minPlan === "pro" ? "PRO" : "BASIC+"}
            </span>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[340px] rounded-2xl text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              ميزة {minPlan === "pro" ? "احترافية" : "مدفوعة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature || "هذه الميزة"} متاحة فقط في الباقة {minPlan === "pro" ? "الاحترافية" : "الأساسية أو أعلى"}. قم بالترقية للاستفادة من جميع الميزات المتقدمة.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => { setOpen(false); navigate("/plans"); }} className="w-full gap-2">
                <Crown className="h-4 w-4" />
                عرض الباقات
              </Button>
              <button onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                لاحقاً
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

/** Small badge for menu items */
export const ProBadge = ({ tier = "pro" }: { tier?: "basic" | "pro" }) => {
  const { plan } = usePlan();
  const hasAccess = tier === "basic" 
    ? (plan === "basic" || plan === "pro") 
    : plan === "pro";
  if (hasAccess) return null;
  const isProTier = tier === "pro";
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
      isProTier 
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" 
        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    }`}>
      <Crown className="h-2.5 w-2.5" />
      {isProTier ? "احترافية" : "أساسية"}
    </span>
  );
};
