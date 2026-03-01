import { useState } from "react";
import { Crown, Sparkles, Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/hooks/usePlan";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProGateProps {
  children: React.ReactNode;
  feature?: string;
  /** Minimum plan required. Defaults to "pro" */
  minPlan?: "basic" | "pro";
}

export const TIER_CONFIG = {
  basic: {
    label: "الأساسية",
    color: "border-blue-500/30 bg-blue-500/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
    icon: Zap,
    features: [
      "100 منتج",
      "أكواد خصم غير محدودة",
      "حتى 3 متاجر",
      "حتى 2 مديرين",
    ],
  },
  pro: {
    label: "الاحترافية",
    color: "border-amber-500/30 bg-amber-500/5",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    buttonClass: "bg-amber-600 hover:bg-amber-700 text-white",
    icon: Crown,
    features: [
      "منتجات غير محدودة",
      "جميع القوالب المميزة",
      "بيكسل وتتبع",
      "تقارير متقدمة",
    ],
  },
};

/** Check if user has access to a given tier */
export const useHasAccess = (minPlan: "basic" | "pro") => {
  const { plan } = usePlan();
  return minPlan === "basic"
    ? (plan === "basic" || plan === "pro")
    : plan === "pro";
};

/** Upgrade card content (reusable in both inline and dialog) */
const UpgradeCardContent = ({ feature, minPlan = "pro" }: { feature?: string; minPlan?: "basic" | "pro" }) => {
  const navigate = useNavigate();
  const config = TIER_CONFIG[minPlan];
  const TierIcon = config.icon;

  return (
    <div className={`border-2 rounded-2xl p-5 space-y-4 ${config.color}`}>
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${config.iconBg}`}>
          <TierIcon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              {feature || "هذه الميزة"}
            </h3>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${config.badgeBg}`}>
              {config.label}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            متاحة في الباقة {config.label} {minPlan === "basic" ? "أو أعلى" : "فقط"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {config.features.map((feat) => (
          <div key={feat} className="flex items-center gap-1.5">
            <Sparkles className={`h-3 w-3 flex-shrink-0 ${config.iconColor}`} />
            <span className="text-[11px] text-foreground">{feat}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={() => navigate("/plans")}
        className={`w-full h-11 rounded-xl font-bold gap-2 ${config.buttonClass}`}
      >
        <TierIcon className="h-4 w-4" />
        ترقية للباقة {config.label}
        <ArrowLeft className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

/** Wraps content that requires a paid plan. Shows blurred preview + upgrade card. */
export const ProGate = ({ children, feature, minPlan = "pro" }: ProGateProps) => {
  const hasAccess = useHasAccess(minPlan);

  if (hasAccess) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[2px] opacity-60 max-h-[300px] overflow-hidden">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent rounded-xl" />
      <div className="absolute bottom-0 inset-x-0 backdrop-blur-md">
        <UpgradeCardContent feature={feature} minPlan={minPlan} />
      </div>
    </div>
  );
};

/** Dialog-based upgrade popup - use for click interception */
export const UpgradeDialog = ({ open, onOpenChange, feature, minPlan = "pro" }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
  minPlan?: "basic" | "pro";
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[380px] rounded-2xl p-0 overflow-hidden border-0">
      <UpgradeCardContent feature={feature} minPlan={minPlan} />
    </DialogContent>
  </Dialog>
);

/** Small badge for menu items */
export const ProBadge = ({ tier = "pro" }: { tier?: "basic" | "pro" }) => {
  const hasAccess = useHasAccess(tier);
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
