import { House, ShoppingBag, Box, BarChart3, Ellipsis } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

const BottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (location.pathname === "/register") return null;

  const tabs = [
    { path: "/", icon: House, label: t.nav.home },
    { path: "/orders", icon: ShoppingBag, label: t.nav.orders },
    { path: "/inventory", icon: Box, label: t.nav.products },
    { path: "/stats", icon: BarChart3, label: t.nav.stats },
    { path: "/more", icon: Ellipsis, label: t.nav.more },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px]"
            >
              <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-[10px] mt-1 font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomBar;
