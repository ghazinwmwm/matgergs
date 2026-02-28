import { House, ShoppingBag, Box, UsersRound, Ellipsis } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", icon: House, label: "الرئيسية" },
  { path: "/orders", icon: ShoppingBag, label: "الطلبات" },
  { path: "/inventory", icon: Box, label: "المنتجات" },
  { path: "/customers", icon: UsersRound, label: "العملاء" },
  { path: "/more", icon: Ellipsis, label: "المزيد" },
];

const BottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on register page
  if (location.pathname === "/register") return null;

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
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[10px] mt-1 font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
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
