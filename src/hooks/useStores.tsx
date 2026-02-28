import { createContext, useContext, useState, ReactNode } from "react";

export interface StoreItem {
  id: string;
  name: string;
  slug: string;
  domain: string;
  description: string;
  category: string;
  location: string;
  logo: string | null;
  whatsapp: string;
  products: number;
  orders: number;
  revenue: number;
  managers: number;
  active: boolean;
  createdAt: string;
  socialLinks: Record<string, string>;
}

const MOCK_STORES: StoreItem[] = [
  {
    id: "1",
    name: "المتجر الرئيسي",
    slug: "mystore",
    domain: "mystore.matager.store",
    description: "متجر متخصص في الملابس الرجالية والنسائية الأنيقة",
    category: "ملابس وأزياء",
    location: "بغداد",
    logo: null,
    whatsapp: "07701234567",
    products: 45,
    orders: 120,
    revenue: 8500000,
    managers: 2,
    active: true,
    createdAt: "2024-01-15",
    socialLinks: { instagram: "https://instagram.com/mystore", facebook: "https://facebook.com/mystore" },
  },
  {
    id: "2",
    name: "فرع المنصور",
    slug: "mansour",
    domain: "mansour.matager.store",
    description: "فرع المنصور للأحذية والحقائب الفاخرة",
    category: "أحذية وحقائب",
    location: "المنصور - بغداد",
    logo: null,
    whatsapp: "07709876543",
    products: 28,
    orders: 67,
    revenue: 4200000,
    managers: 1,
    active: true,
    createdAt: "2024-06-20",
    socialLinks: { instagram: "https://instagram.com/mansour" },
  },
];

interface StoreContextType {
  stores: StoreItem[];
  activeStoreId: string;
  activeStore: StoreItem;
  setActiveStoreId: (id: string) => void;
  addStore: (store: Omit<StoreItem, "id" | "products" | "orders" | "revenue" | "managers" | "active" | "createdAt">) => void;
  updateStore: (store: StoreItem) => void;
  deleteStore: (id: string) => void;
  toggleStoreActive: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<StoreItem[]>(MOCK_STORES);
  const [activeStoreId, setActiveStoreId] = useState(MOCK_STORES[0].id);

  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  const addStore = (data: Omit<StoreItem, "id" | "products" | "orders" | "revenue" | "managers" | "active" | "createdAt">) => {
    const newStore: StoreItem = {
      ...data,
      id: Date.now().toString(),
      products: 0,
      orders: 0,
      revenue: 0,
      managers: 1,
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setStores((prev) => [newStore, ...prev]);
    setActiveStoreId(newStore.id);
  };

  const updateStore = (store: StoreItem) => {
    setStores((prev) => prev.map((s) => (s.id === store.id ? store : s)));
  };

  const deleteStore = (id: string) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
    if (activeStoreId === id) {
      setActiveStoreId(stores.find((s) => s.id !== id)?.id || "");
    }
  };

  const toggleStoreActive = (id: string) => {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  return (
    <StoreContext.Provider value={{ stores, activeStoreId, activeStore, setActiveStoreId, addStore, updateStore, deleteStore, toggleStoreActive }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStores must be used within StoreProvider");
  return ctx;
};
