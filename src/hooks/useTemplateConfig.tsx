import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import type { BusinessType } from "./useOnboarding";

// Hex to HSL conversion utility
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslString(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return "0 0% 0%";
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

function adjustLightness(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return "0 0% 50%";
  const newL = Math.max(0, Math.min(100, hsl.l + amount));
  return `${hsl.h} ${hsl.s}% ${newL}%`;
}

export { hexToHsl, hslString, adjustLightness };

// ═══════════════════════════════════════
// TYPES
// ═══════════════════════════════════════

export interface SectionConfig {
  id: string;
  label: string;
  enabled: boolean;
  icon: string;
  subtitle: string;
  editable?: boolean;
  color: string;
}

export interface ServiceItem { icon: string; title: string; desc: string; }
export interface WorkItem { title: string; category: string; image?: string; link?: string; }
export interface TestimonialItem { name: string; role: string; text: string; rating: number; }

export interface CustomFont {
  name: string;
  url: string; // data URL from uploaded file
}

export interface TemplateColors {
  primary: string;
  accent: string;
  bg: string;
  text: string;
}

export interface AnnouncementBar {
  enabled: boolean;
  text: string;
  bgColor: string;
  textColor: string;
}

export interface CategorySectionItem {
  id: string;
  category: string;
  enabled: boolean;
}

export interface CategoryIconItem {
  category: string;
  image: string | null;
  icon: string;
}

export interface TemplateConfig {
  businessType: BusinessType;

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
  customFonts: CustomFont[];

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

  // Storefront enhancements
  announcementBar: AnnouncementBar;
  bannerImages: string[];
  categorySections: CategorySectionItem[];
  categoryIcons: CategoryIconItem[];
  categoryDisplayMode: "pills" | "icons";

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

// Sections are OFF by default except "store"
export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "hero", label: "صفحة الهبوط", enabled: false, icon: "Layout", subtitle: "العنوان والوصف وأزرار الإجراء", editable: true, color: "hsl(var(--primary))" },
  { id: "services", label: "الخدمات", enabled: false, icon: "Sparkles", subtitle: "عرض خدماتك ومهاراتك", editable: true, color: "hsl(var(--accent))" },
  { id: "works", label: "معرض الأعمال", enabled: false, icon: "Image", subtitle: "نماذج من أعمالك", editable: true, color: "hsl(var(--success))" },
  { id: "store", label: "المتجر", enabled: true, icon: "Monitor", subtitle: "المنتجات", color: "hsl(var(--primary))" },
  { id: "testimonials", label: "آراء العملاء", enabled: false, icon: "Quote", subtitle: "تقييمات وشهادات", editable: true, color: "hsl(var(--accent))" },
  { id: "cta", label: "دعوة للإجراء", enabled: false, icon: "Zap", subtitle: "قسم تحفيزي", editable: true, color: "hsl(var(--destructive))" },
  { id: "about", label: "من نحن", enabled: false, icon: "Globe", subtitle: "تعريف بك أو بفريقك", editable: true, color: "hsl(var(--muted-foreground))" },
];

// Sections enabled by default per business type
const SECTIONS_BY_TYPE: Record<BusinessType, string[]> = {
  physical: ["store"],
  digital: ["store"],
  service: ["hero", "services", "works", "store", "testimonials", "about"],
};

export const getDefaultSectionsForType = (type: BusinessType): SectionConfig[] => {
  const enabledIds = SECTIONS_BY_TYPE[type];
  return DEFAULT_SECTIONS.map(s => ({ ...s, enabled: enabledIds.includes(s.id) }));
};

const DEFAULT_CONFIG: TemplateConfig = {
  businessType: "physical",
  storeName: "متجري",
  tagline: "أفضل المنتجات بأفضل الأسعار",
  storeDescription: "متجر إلكتروني متكامل.",
  heroButtonText: "تصفح المنتجات",
  heroSecondaryButton: "تواصل معنا",
  logoImage: null,

  selectedPreset: 0,
  useCustomColors: false,
  colors: { ...COLOR_PRESETS[0] },
  headingFont: "IBM Plex Sans Arabic",
  bodyFont: "IBM Plex Sans Arabic",
  baseFontSize: "16",
  customFonts: [],

  sections: getDefaultSectionsForType("physical"),

  services: [
    { icon: "Palette", title: "تصميم", desc: "تصميم احترافي" },
    { icon: "Code", title: "تطوير", desc: "برمجة وتطوير" },
    { icon: "Monitor", title: "استشارات", desc: "استشارات رقمية" },
  ],
  works: [
    { title: "مشروع ١", category: "تصميم", link: "" },
    { title: "مشروع ٢", category: "تطوير", link: "" },
    { title: "مشروع ٣", category: "برمجة", link: "" },
  ],
  testimonials: [
    { name: "أحمد", role: "عميل", text: "خدمة ممتازة!", rating: 5 },
    { name: "سارة", role: "عميلة", text: "تجربة رائعة.", rating: 5 },
  ],
  ctaTitle: "مستعد للبدء؟",
  ctaDesc: "تواصل معنا الآن.",
  ctaButton: "تواصل معنا",
  aboutText: "نقدم أفضل الخدمات والمنتجات.",
  aboutFeatures: ["جودة عالية", "تسليم سريع", "دعم مستمر"],

  contactEmail: "",
  contactPhone: "",
  contactInstagram: "",
  contactWebsite: "",
  whatsappNumber: "",
};

// ═══════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════

const STORAGE_KEY = "template-config";

const loadConfig = (): TemplateConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_CONFIG;
};

interface TemplateConfigContextType {
  config: TemplateConfig;
  updateConfig: (partial: Partial<TemplateConfig>) => void;
  resetConfig: () => void;
  resetForBusinessType: (type: BusinessType) => void;
  getActiveColors: () => TemplateColors;
  storefrontCssVars: Record<string, string>;
}

const TemplateConfigContext = createContext<TemplateConfigContextType | undefined>(undefined);

export const TemplateConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TemplateConfig>(loadConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(e.newValue) }); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Inject custom fonts into document
  useEffect(() => {
    config.customFonts.forEach(font => {
      const existing = document.getElementById(`custom-font-${font.name}`);
      if (!existing) {
        const style = document.createElement("style");
        style.id = `custom-font-${font.name}`;
        style.textContent = `@font-face { font-family: '${font.name}'; src: url('${font.url}'); }`;
        document.head.appendChild(style);
      }
    });
  }, [config.customFonts]);

  const updateConfig = useCallback((partial: Partial<TemplateConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const resetConfig = useCallback(() => setConfig(DEFAULT_CONFIG), []);

  const resetForBusinessType = useCallback((type: BusinessType) => {
    const presetIndex = type === "digital" ? 1 : type === "service" ? 2 : 0;
    setConfig({
      ...DEFAULT_CONFIG,
      businessType: type,
      sections: getDefaultSectionsForType(type),
      selectedPreset: presetIndex,
      colors: { ...COLOR_PRESETS[presetIndex] },
      storeName: type === "service" ? "استوديو" : type === "digital" ? "متجري الرقمي" : "متجري",
      tagline: type === "service" ? "نصنع تجارب رقمية مميزة" : type === "digital" ? "منتجات رقمية بجودة عالية" : "أفضل المنتجات بأفضل الأسعار",
      storeDescription: type === "service" ? "خدمات احترافية في التصميم والتطوير." : type === "digital" ? "دورات وكتب وأدوات رقمية." : "متجر إلكتروني متكامل.",
    });
  }, []);

  const getActiveColors = useCallback((): TemplateColors => {
    if (config.useCustomColors) return config.colors;
    return COLOR_PRESETS[config.selectedPreset] || COLOR_PRESETS[0];
  }, [config.useCustomColors, config.colors, config.selectedPreset]);

  const storefrontCssVars = useMemo(() => {
    const c = getActiveColors();
    const isDark = (hexToHsl(c.bg)?.l ?? 100) < 50;
    return {
      '--background': hslString(c.bg),
      '--foreground': hslString(c.text),
      '--card': isDark ? adjustLightness(c.bg, 8) : adjustLightness(c.bg, -3),
      '--card-foreground': hslString(c.text),
      '--primary': hslString(c.primary),
      '--primary-foreground': '0 0% 100%',
      '--secondary': isDark ? adjustLightness(c.bg, 12) : adjustLightness(c.bg, -6),
      '--secondary-foreground': hslString(c.text),
      '--muted': isDark ? adjustLightness(c.bg, 15) : adjustLightness(c.bg, -8),
      '--muted-foreground': adjustLightness(c.text, isDark ? -30 : 30),
      '--accent': hslString(c.accent),
      '--accent-foreground': hslString(c.text),
      '--border': isDark ? adjustLightness(c.bg, 18) : adjustLightness(c.bg, -12),
      '--ring': hslString(c.primary),
    } as Record<string, string>;
  }, [getActiveColors]);

  return (
    <TemplateConfigContext.Provider value={{ config, updateConfig, resetConfig, resetForBusinessType, getActiveColors, storefrontCssVars }}>
      {children}
    </TemplateConfigContext.Provider>
  );
};

export const useTemplateConfig = () => {
  const ctx = useContext(TemplateConfigContext);
  if (!ctx) throw new Error("useTemplateConfig must be used within TemplateConfigProvider");
  return ctx;
};
