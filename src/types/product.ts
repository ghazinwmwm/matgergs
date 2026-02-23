export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  image: string;
  sizes: string[];
  colors: string[];
}

export const DEFAULT_CATEGORIES = [
  "ملابس رجالية",
  "ملابس نسائية",
  "أحذية",
  "إكسسوارات",
  "إلكترونيات",
  "أخرى",
];
