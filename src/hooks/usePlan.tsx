import { createContext, useContext, useState, ReactNode } from "react";

type Plan = "basic" | "pro";

interface PlanContextType {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  isPro: boolean;
}

const PlanContext = createContext<PlanContextType>({
  plan: "basic",
  setPlan: () => {},
  isPro: false,
});

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<Plan>("basic");
  return (
    <PlanContext.Provider value={{ plan, setPlan, isPro: plan === "pro" }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
