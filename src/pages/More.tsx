import { useState } from "react";
import { 
  Store, UserCog, Palette, Truck, Activity, Ticket,
  BarChart3, Settings, ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProBadge, UpgradeDialog, useHasAccess } from "@/components/ProGate";
import { usePlan } from "@/hooks/usePlan";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/hooks/useLanguage";

const More = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { plan } = usePlan();
  const [upgradeDialog, setUpgradeDialog] = useState<{ open: boolean; feature: string; minPlan: "basic" | "pro" }>({
    open: false, feature: "", minPlan: "basic"
  });

  const hasBasicAccess = plan === "basic" || plan === "pro";
  const hasProAccess = plan === "pro";

  const checkAccess = (minPlan?: "basic" | "pro") => {
    if (!minPlan) return true;
    if (minPlan === "basic") return hasBasicAccess;
    return hasProAccess;
  };

  const sections = [
    {
      title: t.more.storeManagement,
      items: [
        { icon: Store, label: t.more.stores, path: "/stores", desc: t.more.storesDesc, minPlan: "basic" as const },
        { icon: UserCog, label: t.more.team, path: "/team", desc: t.more.teamDesc, minPlan: "basic" as const },
        { icon: Ticket, label: t.more.coupons, path: "/coupons", desc: t.more.couponsDesc, minPlan: "basic" as const },
        { icon: Palette, label: t.more.templates, path: "/templates", desc: t.more.templatesDesc, minPlan: "pro" as const },
      ],
    },
    {
      title: t.more.integrations,
      items: [
        { icon: Truck, label: t.more.delivery, path: "/delivery", desc: t.more.deliveryDesc },
        { icon: Activity, label: t.more.tracking, path: "/tracking", desc: t.more.trackingDesc, minPlan: "pro" as const },
      ],
    },
    {
      title: t.more.general,
      items: [
        { icon: Settings, label: t.more.settingsLabel, path: "/profile", desc: t.more.settingsDesc },
      ],
    },
  ];

  const handleItemClick = (item: { path: string; label: string; minPlan?: "basic" | "pro" }) => {
    if (item.minPlan && !checkAccess(item.minPlan)) {
      setUpgradeDialog({ open: true, feature: item.label, minPlan: item.minPlan });
      return;
    }
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={t.more.title} showBack={false} />
      <main className="container mx-auto px-4 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-1">{section.title}</h2>
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {section.items.map((item) => (
                <button key={item.label} onClick={() => handleItemClick(item)} className="flex items-center gap-3 w-full px-4 py-3 text-right hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      {"minPlan" in item && item.minPlan && <ProBadge tier={item.minPlan} />}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronLeft className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>

      <UpgradeDialog
        open={upgradeDialog.open}
        onOpenChange={(open) => setUpgradeDialog(prev => ({ ...prev, open }))}
        feature={upgradeDialog.feature}
        minPlan={upgradeDialog.minPlan}
      />
    </div>
  );
};

export default More;
