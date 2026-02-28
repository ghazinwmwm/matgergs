import { Store, ChevronDown, Check } from "lucide-react";
import { useStores } from "@/hooks/useStores";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface StoreSwitcherProps {
  showAll?: boolean;
  value?: string; // "all" or store id
  onChange?: (value: string) => void;
  compact?: boolean;
}

const StoreSwitcher = ({ showAll = true, value, onChange, compact = false }: StoreSwitcherProps) => {
  const { stores, activeStoreId, setActiveStoreId } = useStores();
  const { lang } = useLanguage();

  // If controlled (value/onChange), use those; otherwise use global activeStoreId
  const selected = value ?? activeStoreId;
  const handleSelect = (id: string) => {
    if (onChange) {
      onChange(id);
    } else {
      setActiveStoreId(id);
    }
  };

  const selectedStore = selected === "all" ? null : stores.find((s) => s.id === selected);
  const label = selected === "all"
    ? (lang === "ku" ? "هەموو فرۆشگاکان" : "كل المتاجر")
    : (selectedStore?.name || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors ${compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"} font-medium`}>
          <Store className={compact ? "h-3.5 w-3.5 text-muted-foreground" : "h-4 w-4 text-muted-foreground"} />
          <span className="truncate max-w-[120px]">{label}</span>
          <ChevronDown className={compact ? "h-3 w-3 text-muted-foreground" : "h-3.5 w-3.5 text-muted-foreground"} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {showAll && (
          <>
            <DropdownMenuItem
              onClick={() => handleSelect("all")}
              className="flex items-center justify-between gap-2"
            >
              <span className="text-sm">{lang === "ku" ? "هەموو فرۆشگاکان" : "كل المتاجر"}</span>
              {selected === "all" && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => handleSelect(store.id)}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {store.logo ? (
                  <img src={store.logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Store className="h-3 w-3 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-sm truncate block">{store.name}</span>
                {!store.active && (
                  <span className="text-[10px] text-muted-foreground">
                    {lang === "ku" ? "ناچالاک" : "متوقف"}
                  </span>
                )}
              </div>
            </div>
            {selected === store.id && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StoreSwitcher;
