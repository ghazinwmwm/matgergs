import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ═══════════════════════════════════════
// TYPES
// ═══════════════════════════════════════

export interface SectionConfig {
  id: string;
  label: string;
  enabled: boolean;
  icon: string; // icon name string for serialization
  subtitle: string;
  editable?: boolean;
  color: string;
}

export interface ServiceItem { icon: string; title: string; desc: string; }
export interface WorkItem { title: string; category: string; image?: string; }
export interface TestimonialItem { name: string; role: string; text: string; rating: number; }

export interface TemplateColors {
  primary: string;
  accent: string;
  bg: string;
  text: string;
}

export interface TemplateConfig {
  // Brand
  storeName: string;
  tagline: string;
  storeDescription: string;
  heroButtonText: string;
  heroSecondaryButton: string;
  logoImage: string | null;

  // Style
  selectedPreset: number;
  useCustomColors: boolean;
  colors: TemplateColors;
  headingFont: string;
  bodyFont: string;
  baseFontSize: string;

  // Sections
  sections: SectionConfig[];

  // Content
  services: ServiceItem[];
  works: WorkItem[];
  testimonials: TestimonialItem[];
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
  aboutText: string;
  aboutFeatures: string[];

  // Contact
  contactEmail: string;
  contactPhone: string;
  contactInstagram: string;
  contactWebsite: string;
  whatsappNumber: string;
}

// ═══════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════

export const COLOR_PRESETS: TemplateColors[] = [
  { primary: "#0EA5E9", accent: "#06B6D4", bg: "#FFFFFF", text: "#1a2332" },
  { primary: "#8B5CF6", accent: "#A78BFA", bg: "#FFFFFF", text: "#1a1a2e" },
  { primary: "#10B981", accent: "#34D399", bg: "#FFFFFF", text: "#1a2e1a" },
  { primary: "#F97316", accent: "#FB923C", bg: "#FFFFFF", text: "#2e1a0c" },
  { primary: "#EC4899", accent: "#F472B6", bg: "#FFFFFF", text: "#2e1a24" },
  { primary: "#6366F1", accent: "#818CF8", bg: "#0F172A", text: "#F1F5F9" },
  { primary: "#D4AF37", accent: "#F0D060", bg: "#1A1A1A", text: "#FAFAFA" },
  { primary: "#EF4444", accent: "#F87171", bg: "#FFFFFF", text: "#1a1a1a" },
];

export const COLOR_PRESET_NAMES = ["تيركوازي", "بنفسجي", "أخضر", "برتقالي", "وردي", "داكن", "ذهبي", "أحمر"];

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "hero", label: "البطل الرئيسي", enabled: true, icon: "Layout", subtitle: "العنوان والوصف وأزرار الإجراء", editable: true, color: "hsl(var(--primary))" },
  { id: "services", label: "الخدمات", enabled: true, icon: "Sparkles", subtitle: "عرض خدماتك ومهاراتك", editable: true, color: "hsl(var(--accent))" },
  { id: "works", label: "معرض الأعمال", enabled: true, icon: "Image", subtitle: "نماذج من أعمالك", editable: true, color: "hsl(var(--success))" },
  { id: "store", label: "المتجر", enabled: true, icon: "Monitor", subtitle: "المنتجات الرقمية", color: "hsl(var(--primary))" },
  { id: "testimonials", label: "آراء العملاء", enabled: true, icon: "Quote", subtitle: "تقييمات وشهادات", editable: true, color: "hsl(var(--accent))" },
  { id: "cta", label: "دعوة للإجراء", enabled: true, icon: "Zap", subtitle: "قسم تحفيزي", editable: true, color: "hsl(var(--destructive))" },
  { id: "about", label: "من نحن", enabled: true, icon: "Globe", subtitle: "تعريف بك أو بفريقك", editable: true, color: "hsl(var(--muted-foreground))" },
];

const DEFAULT_CONFIG: TemplateConfig = {
  storeName: "استوديو إبداع",
  tagline: "نصنع تجارب رقمية تُلهم",
  storeDescription: "دورات تعليمية، أدوات تصميم، وخدمات إبداعية.",
  heroButtonText: "تصفح المتجر",
  heroSecondaryButton: "شاهد أعمالنا",
  logoImage: null,

  selectedPreset: 0,
  useCustomColors: false,
  colors: { ...COLOR_PRESETS[0] },
  headingFont: "IBM Plex Sans Arabic",
  bodyFont: "IBM Plex Sans Arabic",
  baseFontSize: "16",

  sections: DEFAULT_SECTIONS,

  services: [
    { icon: "Palette", title: "تصميم جرافيك", desc: "هويات بصرية وشعارات احترافية" },
    { icon: "Monitor", title: "تصميم واجهات", desc: "UI/UX لتطبيقات الموبايل والويب" },
    { icon: "Code", title: "تطوير ويب", desc: "مواقع ومتاجر بأحدث التقنيات" },
  ],
  works: [
    { title: "هوية بصرية لمطعم", category: "هوية بصرية" },
    { title: "تطبيق توصيل", category: "تصميم واجهات" },
    { title: "موقع عقارات", category: "تطوير ويب" },
  ],
  testimonials: [
    { name: "سارة أحمد", role: "مديرة تسويق", text: "تجربة رائعة غيّرت مساري المهني!", rating: 5 },
    { name: "محمد علي", role: "مطور مستقل", text: "أفضل محتوى عربي والدعم ممتاز.", rating: 5 },
  ],
  ctaTitle: "مستعد للبدء؟",
  ctaDesc: "انضم لآلاف العملاء الذين يثقون بنا.",
  ctaButton: "تصفح المنتجات",
  aboutText: "فريق من المبدعين نؤمن بأن كل شخص يستحق محتوى رقمي عربي عالي الجودة.",
  aboutFeatures: ["+٥ سنوات خبرة", "تسليم فوري", "ضمان الجودة"],

  contactEmail: "hello@studio.com",
  contactPhone: "+964 770 123 4567",
  contactInstagram: "@studio_iq",
  contactWebsite: "www.studio.com",
  whatsappNumber: "",
};

// ═══════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════

interface TemplateConfigContextType {
  config: TemplateConfig;
  updateConfig: (partial: Partial<TemplateConfig>) => void;
  resetConfig: () => void;
  getActiveColors: () => TemplateColors;
}

const TemplateConfigContext = createContext<TemplateConfigContextType | undefined>(undefined);

export const TemplateConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TemplateConfig>(DEFAULT_CONFIG);

  const updateConfig = (partial: Partial<TemplateConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  const resetConfig = () => setConfig(DEFAULT_CONFIG);

  const getActiveColors = (): TemplateColors => {
    if (config.useCustomColors) return config.colors;
    return COLOR_PRESETS[config.selectedPreset] || COLOR_PRESETS[0];
  };

  return (
    <TemplateConfigContext.Provider value={{ config, updateConfig, resetConfig, getActiveColors }}>
      {children}
    </TemplateConfigContext.Provider>
  );
};

export const useTemplateConfig = () => {
  const ctx = useContext(TemplateConfigContext);
  if (!ctx) throw new Error("useTemplateConfig must be used within TemplateConfigProvider");
  return ctx;
};
