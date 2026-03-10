import { createContext, useContext, useState, ReactNode } from "react";

export type BusinessType = "physical" | "digital" | "service";

interface OnboardingContextType {
  isOnboarded: boolean;
  businessType: BusinessType;
  setBusinessType: (type: BusinessType) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem("matager_onboarded") === "true";
  });
  const [businessType, setBusinessTypeState] = useState<BusinessType>(() => {
    return (localStorage.getItem("matager_business_type") as BusinessType) || "physical";
  });

  const setBusinessType = (type: BusinessType) => {
    localStorage.setItem("matager_business_type", type);
    setBusinessTypeState(type);
  };

  const completeOnboarding = () => {
    localStorage.setItem("matager_onboarded", "true");
    setIsOnboarded(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem("matager_onboarded");
    localStorage.removeItem("matager_business_type");
    setIsOnboarded(false);
    setBusinessTypeState("physical");
  };

  return (
    <OnboardingContext.Provider value={{ isOnboarded, businessType, setBusinessType, completeOnboarding, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
};
