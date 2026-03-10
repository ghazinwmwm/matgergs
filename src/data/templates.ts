export interface Template {
  id: string;
  name: string;
  description: string;
  type: "store" | "digital" | "service";
  colors: string[];
  features: string[];
}

export const TEMPLATES: Template[] = [
  {
    id: "physical-store",
    name: "متجر منتجات",
    description: "قالب متكامل لبيع المنتجات المادية مع سلة تسوق وإدارة طلبات",
    type: "store",
    colors: ["#0EA5E9", "#06B6D4", "#FFFFFF"],
    features: ["سلة تسوق", "إدارة طلبات", "توصيل", "أكواد خصم"],
  },
  {
    id: "digital-store",
    name: "متجر رقمي",
    description: "قالب لبيع المنتجات الرقمية مثل الدورات والكتب والملفات",
    type: "digital",
    colors: ["#8B5CF6", "#A78BFA", "#FFFFFF"],
    features: ["تسليم فوري", "رابط أو ملف أو إيميل", "دفع إلكتروني", "تحميل تلقائي"],
  },
  {
    id: "service-store",
    name: "صفحة خدمات",
    description: "صفحة هبوط ومعرض أعمال لمقدمي الخدمات مع روابط دفع سريعة",
    type: "service",
    colors: ["#10B981", "#34D399", "#FFFFFF"],
    features: ["صفحة هبوط", "معرض أعمال", "رابط دفع سريع", "تواصل مباشر"],
  },
];
