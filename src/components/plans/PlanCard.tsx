import { ReactNode } from "react";

interface PlanCardProps {
  planId: string;
  selected: boolean;
  isCurrent: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  price: number;
  billingPeriod: string;
  currency: string;
  perMonth: string;
  currentLabel: string;
  badge?: string;
  freeLabel?: string;
  onSelect: () => void;
}

const PlanCard = ({ planId, selected, isCurrent, icon, title, description, price, currency, perMonth, currentLabel, badge, freeLabel, onSelect }: PlanCardProps) => {
  const isFree = price === 0;

  return (
    <div
      onClick={onSelect}
      className={`bg-card border-2 rounded-2xl overflow-hidden transition-all cursor-pointer ${
        selected ? "border-primary shadow-sm" : "border-border"
      }`}
    >
      {badge && (
        <div className="bg-primary text-primary-foreground text-[10px] font-bold text-center py-1.5">{badge}</div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary" : "border-muted-foreground/30"}`}>
              {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            {icon}
            {isCurrent && <span className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-bold">{currentLabel}</span>}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        <div className="flex items-baseline gap-1">
          {isFree ? (
            <span className="text-2xl font-bold text-foreground">{freeLabel || "مجاني"}</span>
          ) : (
            <>
              <span className="text-2xl font-bold text-foreground">{price.toLocaleString("ar-IQ")}</span>
              <span className="text-xs text-muted-foreground">{currency} {perMonth}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
