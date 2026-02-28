export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  images: string[];
  sizes: string[];
  colors: string[];
  returnPolicy: string;
  deliveryDays: number | null;
  stock?: number;
}

export const DEFAULT_CATEGORIES = [
  "ملابس رجالية",
  "ملابس نسائية",
  "أحذية",
  "إكسسوارات",
  "إلكترونيات",
  "أخرى",
];
