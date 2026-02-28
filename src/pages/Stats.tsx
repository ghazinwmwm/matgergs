import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign, Package, Calendar, Wallet, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ProGate } from "@/components/ProGate";
import PageHeader from "@/components/PageHeader";

const REVENUE_DATA = [
  { day: "السبت", value: 320000 },
  { day: "الأحد", value: 450000 },
  { day: "الإثنين", value: 280000 },
  { day: "الثلاثاء", value: 520000 },
  { day: "الأربعاء", value: 390000 },
  { day: "الخميس", value: 680000 },
  { day: "الجمعة", value: 410000 },
];

const ORDERS_DATA = [
  { day: "السبت", value: 5 },
  { day: "الأحد", value: 8 },
  { day: "الإثنين", value: 4 },
  { day: "الثلاثاء", value: 12 },
  { day: "الأربعاء", value: 7 },
  { day: "الخميس", value: 15 },
  { day: "الجمعة", value: 9 },
];

const TOP_PRODUCTS = [
  { name: "قميص بولو كلاسيكي", sales: 24, revenue: 840000 },
  { name: "حذاء رياضي نايك", sales: 18, revenue: 1260000 },
  { name: "ساعة ذكية", sales: 12, revenue: 960000 },
  { name: "حقيبة جلدية", sales: 9, revenue: 405000 },
];

const PERIODS = ["اليوم", "هذا الأسبوع", "هذا الشهر", "هذه السنة"];

const Stats = () => {
  const [period, setPeriod] = useState("هذا الأسبوع");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const availableBalance = 3050000;

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0 || amount > availableBalance) {
      toast({ title: "خطأ", description: "يرجى إدخال مبلغ صحيح", variant: "destructive" });
      return;
    }
    toast({ title: "تم إرسال الطلب ✓", description: `طلب سحب ${amount.toLocaleString("ar-IQ")} د.ع قيد المراجعة` });
    setWithdrawAmount("");
    setWithdrawOpen(false);
  };
  const summaryStats = [
    { label: "الإيرادات", value: "3,050K", sub: "د.ع", change: 12.5, icon: DollarSign, color: "text-primary" },
    { label: "الطلبات", value: "60", change: 8.3, icon: ShoppingCart, color: "text-accent-foreground" },
    { label: "العملاء الجدد", value: "23", change: 15.2, icon: Users, color: "text-success" },
    { label: "المنتجات المباعة", value: "87", change: -3.1, icon: Package, color: "text-muted-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="الإحصائيات" subtitle="تقارير الأداء والمبيعات" />

      <main className="container mx-auto px-4 space-y-5">
        {/* Period Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Withdraw Button */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground">الرصيد المتاح للسحب</p>
            <p className="text-lg font-bold text-foreground">{availableBalance.toLocaleString("ar-IQ")} <span className="text-[10px] text-muted-foreground">د.ع</span></p>
          </div>
          <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 rounded-lg">
                <Wallet className="h-4 w-4" />
                طلب سحب
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-center">طلب سحب أرباح</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="bg-secondary/50 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">الرصيد المتاح</p>
                  <p className="text-xl font-bold text-foreground">{availableBalance.toLocaleString("ar-IQ")} <span className="text-xs text-muted-foreground">د.ع</span></p>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">المبلغ المطلوب (د.ع)</label>
                  <Input
                    type="number"
                    placeholder="أدخل المبلغ"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="text-center text-lg font-bold"
                  />
                </div>
                <Button onClick={handleWithdraw} className="w-full gap-2 rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  تأكيد طلب السحب
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">سيتم تحويل المبلغ خلال 24-48 ساعة عمل</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className={`text-[10px] font-medium flex items-center gap-0.5 ${stat.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {stat.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(stat.change)}%
                </span>
              </div>
              <span className="text-lg font-bold text-foreground block">
                {stat.value}
                {stat.sub && <span className="text-[10px] text-muted-foreground mr-1">{stat.sub}</span>}
              </span>
              <span className="text-[11px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Advanced Stats - PRO gated */}
        <ProGate feature="التقارير والتحليلات المتقدمة">
          {/* Revenue Chart */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">الإيرادات</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(191, 80%, 42%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(191, 80%, 42%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(200, 20%, 90%)" }} formatter={(value: number) => [`${value.toLocaleString("ar-IQ")} د.ع`, "الإيرادات"]} />
                  <Area type="monotone" dataKey="value" stroke="hsl(191, 80%, 42%)" strokeWidth={2} fill="url(#revenueGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">الطلبات</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ORDERS_DATA}>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(200, 20%, 90%)" }} formatter={(value: number) => [`${value} طلب`, "الطلبات"]} />
                  <Bar dataKey="value" fill="hsl(191, 80%, 42%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-card border border-border rounded-xl">
            <div className="p-4 pb-3">
              <h3 className="text-sm font-semibold text-foreground">أكثر المنتجات مبيعاً</h3>
            </div>
            <div className="divide-y divide-border">
              {TOP_PRODUCTS.map((product, i) => (
                <div key={product.name} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">{product.sales} مبيعة</p>
                  </div>
                  <span className="text-sm font-bold text-foreground whitespace-nowrap">{product.revenue.toLocaleString("ar-IQ")} <span className="text-[9px] text-muted-foreground">د.ع</span></span>
                </div>
              ))}
            </div>
          </div>
        </ProGate>
      </main>
    </div>
  );
};

export default Stats;
