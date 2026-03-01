import { Crown, Sparkles, Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/hooks/usePlan";
import { Button } from "@/components/ui/button";

interface ProGateProps {
  children: React.ReactNode;
  feature?: string;
  /** Minimum plan required. Defaults to "pro" */
  minPlan?: "basic" | "pro";
}

const TIER_CONFIG = {
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

/** Wraps content that requires a paid plan. Shows upgrade card for lower-tier users. */
export const ProGate = ({ children, feature, minPlan = "pro" }: ProGateProps) => {
  const { plan } = usePlan();
  const navigate = useNavigate();

  const hasAccess = minPlan === "basic"
    ? (plan === "basic" || plan === "pro")
    : plan === "pro";

  if (hasAccess) return <>{children}</>;

  const config = TIER_CONFIG[minPlan];
  const TierIcon = config.icon;

  return (
    <div className="relative">
      {/* Blurred preview of actual content */}
      <div className="pointer-events-none select-none blur-[2px] opacity-60 max-h-[300px] overflow-hidden">
        {children}
      </div>
      {/* Fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent rounded-xl" />
      {/* Upgrade card overlaid at bottom */}
      <div className={`absolute bottom-0 inset-x-0 border-2 rounded-2xl p-5 space-y-4 ${config.color} backdrop-blur-md`}>
        {/* Header */}
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

        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-2">
          {config.features.map((feat) => (
            <div key={feat} className="flex items-center gap-1.5">
              <Sparkles className={`h-3 w-3 flex-shrink-0 ${config.iconColor}`} />
              <span className="text-[11px] text-foreground">{feat}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate("/plans")}
          className={`w-full h-11 rounded-xl font-bold gap-2 ${config.buttonClass}`}
        >
          <TierIcon className="h-4 w-4" />
          ترقية للباقة {config.label}
          <ArrowLeft className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
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
