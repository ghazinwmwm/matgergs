import { Home, Package, PlusCircle, BarChart3, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", icon: Home, label: "الرئيسية" },
  { path: "/inventory", icon: Package, label: "المخزون" },
  { path: "/add", icon: PlusCircle, label: "إضافة", isCenter: true },
  { path: "/stats", icon: BarChart3, label: "الإحصائيات" },
  { path: "/profile", icon: User, label: "حسابي" },
];

const BottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-3 mb-3 rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:bg-card/60 dark:border-white/10">
        <div className="flex items-center justify-around py-2 px-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;

            if (tab.isCenter) {
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center justify-center -mt-5"
                >
                  <div className="w-12 h-12 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-primary-foreground transition-transform active:scale-95">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] mt-1 font-medium text-primary">{tab.label}</span>
                </button>
              );
            }

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all"
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] mt-0.5 font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomBar;
