import { 
  Store, UserCog, Palette, Truck, Activity, Ticket,
  BarChart3, Settings, HelpCircle, ChevronLeft, User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProBadge } from "@/components/ProGate";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/hooks/useLanguage";

const More = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const sections = [
    {
      title: t.more.storeManagement,
      items: [
        { icon: Store, label: t.more.stores, path: "/stores", desc: t.more.storesDesc, pro: true },
        { icon: UserCog, label: t.more.team, path: "/team", desc: t.more.teamDesc, pro: true },
        { icon: Ticket, label: t.more.coupons, path: "/coupons", desc: t.more.couponsDesc, pro: false },
        { icon: Palette, label: t.more.templates, path: "/templates", desc: t.more.templatesDesc, pro: true },
      ],
    },
    {
      title: t.more.integrations,
      items: [
        { icon: Truck, label: t.more.delivery, path: "/delivery", desc: t.more.deliveryDesc, pro: false },
        { icon: Activity, label: t.more.tracking, path: "/tracking", desc: t.more.trackingDesc, pro: true },
      ],
    },
    {
      title: t.more.general,
      items: [
        { icon: BarChart3, label: t.more.stats, path: "/stats", desc: t.more.statsDesc, pro: true },
        { icon: User, label: t.more.account, path: "/profile", desc: t.more.accountDesc, pro: false },
        { icon: Settings, label: t.more.settingsLabel, path: "/settings", desc: t.more.settingsDesc, pro: false },
        { icon: HelpCircle, label: t.more.help, path: "/help", desc: t.more.helpDesc, pro: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={t.more.title} showBack={false} />
      <main className="container mx-auto px-4 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-1">{section.title}</h2>
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {section.items.map((item) => (
                <button key={item.label} onClick={() => navigate(item.path)} className="flex items-center gap-3 w-full px-4 py-3 text-right hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      {item.pro && <ProBadge />}
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
    </div>
  );
};

export default More;
