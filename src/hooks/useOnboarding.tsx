import { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingContextType {
  isOnboarded: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem("matager_onboarded") === "true";
  });

  const completeOnboarding = () => {
    localStorage.setItem("matager_onboarded", "true");
    setIsOnboarded(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem("matager_onboarded");
    setIsOnboarded(false);
  };

  return (
    <OnboardingContext.Provider value={{ isOnboarded, completeOnboarding, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
};
