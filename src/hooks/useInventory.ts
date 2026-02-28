import { useState } from "react";
import type { Product } from "@/types/product";
import { DEFAULT_CATEGORIES } from "@/types/product";
import sampleProductImg from "@/assets/sample-product.jpg";

const SAMPLE_PRODUCT: Product = {
  id: "sample-1",
  name: "قميص بولو رجالي كلاسيكي",
  description: "قميص بولو أنيق مصنوع من القطن الممتاز، مريح للارتداء اليومي والمناسبات غير الرسمية.",
  category: "ملابس رجالية",
  price: 35000,
  discount: 15,
  images: [sampleProductImg],
  sizes: ["S", "M", "L", "XL"],
  colors: ["#1E3A5F", "#000000", "#FFFFFF"],
  returnPolicy: "7-days",
  deliveryDays: 3,
  stock: 5,
};

let sharedProducts: Product[] = [SAMPLE_PRODUCT];
let sharedCategories: string[] = [...DEFAULT_CATEGORIES];
const listeners: Set<() => void> = new Set();

export function useInventory() {
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  useState(() => {
    listeners.add(rerender);
    return () => listeners.delete(rerender);
  });

  const notify = () => listeners.forEach((fn) => fn());

  return {
    products: sharedProducts,
    categories: sharedCategories,
    addProduct: (p: Product) => { sharedProducts = [p, ...sharedProducts]; notify(); },
    updateProduct: (p: Product) => { sharedProducts = sharedProducts.map((prod) => prod.id === p.id ? p : prod); notify(); },
    deleteProduct: (id: string) => { sharedProducts = sharedProducts.filter((p) => p.id !== id); notify(); },
    addCategory: (cat: string) => {
      if (!sharedCategories.includes(cat)) { sharedCategories = [...sharedCategories, cat]; notify(); }
    },
    lowStockProducts: sharedProducts.filter((p) => p.stock !== undefined && p.stock <= 5),
  };
}
