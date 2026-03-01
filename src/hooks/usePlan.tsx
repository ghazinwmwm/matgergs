import { createContext, useContext, useState, ReactNode } from "react";

type Plan = "free" | "basic" | "pro";
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
  isFree: boolean;
  isBasic: boolean;
  isPro: boolean;
  /** True if plan is basic or pro (i.e. not free) */
  isPaid: boolean;
  subscription: Subscription;
  daysRemaining: number;
  isExpiringSoon: boolean;
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
  plan: "free",
  billingPeriod: "monthly",
  startDate: defaultStart,
  endDate: getEndDate(defaultStart, "monthly"),
};

const PlanContext = createContext<PlanContextType>({
  plan: "free",
  setPlan: () => {},
  isFree: true,
  isBasic: false,
  isPro: false,
  isPaid: false,
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
  const isExpiringSoon = subscription.plan !== "free" && daysRemaining <= 7;

  return (
    <PlanContext.Provider
      value={{
        plan: subscription.plan,
        setPlan,
        isFree: subscription.plan === "free",
        isBasic: subscription.plan === "basic",
        isPro: subscription.plan === "pro",
        isPaid: subscription.plan !== "free",
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
