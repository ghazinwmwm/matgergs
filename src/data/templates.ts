export interface Template {
  id: string;
  name: string;
  description: string;
  category: "مجاني" | "مميز";
  type: "store" | "digital" | "service";
  colors: string[];
  features: string[];
  popular?: boolean;
  setupSteps?: string[];
}

export const TEMPLATES: Template[] = [
  { id: "minimal", name: "بسيط", description: "تصميم نظيف وبسيط يركز على المنتجات مع تنقل سهل", category: "مجاني", type: "store", colors: ["#FFFFFF", "#000000", "#0EA5E9"], features: ["تصميم متجاوب", "عرض شبكي", "فلتر المنتجات"] },
  { id: "elegant", name: "أنيق", description: "تصميم فاخر مناسب للماركات والمنتجات الراقية", category: "مجاني", type: "store", colors: ["#1A1A2E", "#E2B857", "#FFFFFF"], features: ["تصميم داكن", "أنيميشن سلس", "عرض المنتج بالكامل"], popular: true },
  { id: "vibrant", name: "حيوي", description: "تصميم ملون وعصري مناسب للملابس والأزياء", category: "مجاني", type: "store", colors: ["#FF6B6B", "#4ECDC4", "#FFFFFF"], features: ["ألوان زاهية", "صور كبيرة", "كاروسيل"] },
  { id: "professional", name: "احترافي", description: "تصميم متقدم مع ميزات إضافية للمتاجر الكبيرة", category: "مميز", type: "store", colors: ["#2D3436", "#00B894", "#FFFFFF"], features: ["مقارنة المنتجات", "تقييمات", "مدونة مدمجة", "SEO متقدم"], popular: true },
  { id: "luxury", name: "فخم", description: "تصميم فخم مع تأثيرات بصرية مذهلة", category: "مميز", type: "store", colors: ["#0C0C0C", "#D4AF37", "#FAF0E6"], features: ["تأثيرات 3D", "فيديو خلفية", "عرض VIP", "تخصيص كامل"] },
  { id: "fresh", name: "منعش", description: "تصميم خفيف ومنعش مناسب لمنتجات العناية والجمال", category: "مميز", type: "store", colors: ["#F8F9FA", "#A8E6CF", "#FFB7B2"], features: ["تدرجات لونية", "أيقونات مخصصة", "قسم المراجعات", "عروض خاصة"] },
  {
    id: "digital-basic", name: "منتجات رقمية", description: "قالب مخصص لبيع الكتب الإلكترونية والدورات والملفات الرقمية",
    category: "مجاني", type: "digital", colors: ["#6C5CE7", "#A29BFE", "#FFFFFF"],
    features: ["تحميل فوري", "روابط آمنة", "معاينة المنتج", "دفع إلكتروني"],
    setupSteps: ["أضف منتجك الرقمي (كتاب، دورة، ملف)", "حدد السعر وطريقة التسليم", "فعّل الدفع الإلكتروني", "شارك رابط متجرك"],
  },
  {
    id: "digital-pro", name: "أكاديمية رقمية", description: "منصة متكاملة لبيع الدورات التعليمية مع نظام اشتراكات",
    category: "مميز", type: "digital", colors: ["#2D3436", "#6C5CE7", "#FDCB6E"],
    features: ["نظام اشتراكات", "مستويات وصول", "شهادات إتمام", "بث مباشر"], popular: true,
    setupSteps: ["أنشئ الدورة وأضف المحتوى", "حدد مستويات الاشتراك", "فعّل نظام الشهادات", "ابدأ البيع"],
  },
  {
    id: "service-basic", name: "خدمات", description: "قالب لعرض وبيع الخدمات المتنوعة مثل التصميم والبرمجة والاستشارات",
    category: "مجاني", type: "service", colors: ["#00B894", "#00CEC9", "#FFFFFF"],
    features: ["حجز مواعيد", "عرض الباقات", "نماذج أعمال", "تواصل مباشر"],
    setupSteps: ["أضف خدماتك مع الوصف والسعر", "حدد أوقات التوفر", "أضف نماذج أعمالك السابقة", "فعّل نظام الحجز"],
  },
  {
    id: "service-pro", name: "وكالة احترافية", description: "قالب متقدم للوكالات ومقدمي الخدمات المتخصصة",
    category: "مميز", type: "service", colors: ["#0C0C0C", "#00B894", "#E17055"],
    features: ["إدارة مشاريع", "عقود رقمية", "فواتير تلقائية", "تقارير للعملاء"], popular: true,
    setupSteps: ["أنشئ ملف الوكالة", "أضف الخدمات والباقات", "فعّل نظام العقود والفواتير", "ابدأ استقبال العملاء"],
  },
];
