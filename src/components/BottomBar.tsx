import { House, ShoppingBag, Box, UsersRound, Ellipsis, Store, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useStores } from "@/hooks/useStores";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const BottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { stores, activeStoreId, setActiveStoreId, activeStore } = useStores();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (location.pathname === "/register") return null;

  const tabs = [
    { path: "/", icon: House, label: t.nav.home },
    { path: "/orders", icon: ShoppingBag, label: t.nav.orders },
    { id: "store-switcher", icon: Store, label: activeStore?.name?.slice(0, 6) || (lang === "ku" ? "فرۆشگا" : "المتجر") },
    { path: "/customers", icon: UsersRound, label: t.nav.customers },
    { path: "/more", icon: Ellipsis, label: t.nav.more },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          if (tab.id === "store-switcher") {
            return (
              <Drawer key="store-switcher" open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <button className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px]">
                    <div className="relative">
                      <Store className="h-5 w-5 transition-colors text-primary" />
                    </div>
                    <span className="text-[10px] mt-1 font-medium text-primary truncate max-w-[56px]">
                      {tab.label}
                    </span>
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>{lang === "ku" ? "فرۆشگا هەڵبژێرە" : "اختر المتجر"}</DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 pb-6 space-y-1.5">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => { setActiveStoreId(store.id); setDrawerOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                          activeStoreId === store.id ? "bg-primary/10 border border-primary/30" : "bg-card border border-border hover:bg-muted"
                        )}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {store.logo ? (
                            <img src={store.logo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Store className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm font-semibold text-foreground">{store.name}</p>
                          <p className="text-[11px] text-muted-foreground" dir="ltr">{store.domain}</p>
                        </div>
                        {activeStoreId === store.id && <Check className="h-5 w-5 text-primary flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </DrawerContent>
              </Drawer>
            );
          }
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path!)}
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
