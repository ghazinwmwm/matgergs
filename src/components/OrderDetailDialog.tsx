import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { Package, MapPin, Truck, Clock } from "lucide-react";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status_ar: string;
  status_ku: string;
  items: number;
  date: string;
  phone?: string;
  address?: string;
  orderItems?: OrderItem[];
}

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog = ({ order, open, onOpenChange }: OrderDetailDialogProps) => {
  const { t, lang } = useLanguage();
  if (!order) return null;

  const status = lang === "ku" ? order.status_ku : order.status_ar;

  const statusColor: Record<string, string> = {
    "جديد": "bg-primary/10 text-primary", "نوێ": "bg-primary/10 text-primary",
    "قيد التوصيل": "bg-accent/10 text-accent-foreground", "لە گەیاندندا": "bg-accent/10 text-accent-foreground",
    "مكتمل": "bg-success/10 text-success", "تەواوبوو": "bg-success/10 text-success",
    "ملغي": "bg-destructive/10 text-destructive", "هەڵوەشێنراوە": "bg-destructive/10 text-destructive",
  };

  const mockItems: OrderItem[] = order.orderItems || [
    { name: lang === "ku" ? "قەمیسی پۆلۆ" : "قميص بولو", qty: 1, price: 35000 },
    { name: lang === "ku" ? "پانتۆڵی جینز" : "بنطلون جينز", qty: 1, price: 50000 },
  ].slice(0, order.items);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {t.orders.orderDetails} {order.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Status & Date */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[status] || ""}`}>{status}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{order.date}</span>
          </div>

          {/* Customer */}
          <div className="bg-muted rounded-lg p-3 space-y-1">
            <p className="text-sm font-medium text-foreground">{order.customer}</p>
            <p className="text-xs text-muted-foreground" dir="ltr">{order.phone || "0770 123 4567"}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{order.address || (lang === "ku" ? "بەغدا، حەیی المنسوور" : "بغداد، حي المنصور")}</p>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Package className="h-3 w-3" />{t.orders.products}</h4>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {mockItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm text-foreground">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">×{item.qty}</p>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.price.toLocaleString("ar-IQ")} {t.currency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            <span>{t.orders.deliveryStatus}: {status}</span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-foreground">{t.orders.total}</span>
            <span className="text-base font-bold text-primary">{order.amount.toLocaleString("ar-IQ")} {t.currency}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
