import { createContext, useContext, useState, ReactNode } from "react";

type Plan = "basic" | "pro";
type BillingPeriod = "monthly" | "yearly";

interface Subscription {
  plan: Plan;
  billingPeriod: BillingPeriod;
  startDate: Date;
  endDate: Date;
}

interface PlanContextType {
  plan: Plan;
  setPlan: (plan: Plan, billingPeriod?: BillingPeriod) => void;
  isPro: boolean;
  subscription: Subscription;
  daysRemaining: number;
  isExpiringSoon: boolean; // less than 7 days
}

const getEndDate = (start: Date, period: BillingPeriod): Date => {
  const end = new Date(start);
  if (period === "yearly") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
};

const calcDaysRemaining = (endDate: Date): number => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const defaultStart = new Date();
const defaultSub: Subscription = {
  plan: "basic",
  billingPeriod: "monthly",
  startDate: defaultStart,
  endDate: getEndDate(defaultStart, "monthly"),
};

const PlanContext = createContext<PlanContextType>({
  plan: "basic",
  setPlan: () => {},
  isPro: false,
  subscription: defaultSub,
  daysRemaining: 30,
  isExpiringSoon: false,
});

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription>(defaultSub);

  const setPlan = (plan: Plan, billingPeriod: BillingPeriod = "monthly") => {
    const startDate = new Date();
    setSubscription({
      plan,
      billingPeriod,
      startDate,
      endDate: getEndDate(startDate, billingPeriod),
    });
  };

  const daysRemaining = calcDaysRemaining(subscription.endDate);
  const isExpiringSoon = daysRemaining <= 7;

  return (
    <PlanContext.Provider
      value={{
        plan: subscription.plan,
        setPlan,
        isPro: subscription.plan === "pro",
        subscription,
        daysRemaining,
        isExpiringSoon,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
