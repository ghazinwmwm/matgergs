import { useState } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign, Package, Calendar,
  Wallet, CheckCircle2, MapPin, Smartphone, Monitor, Tablet, Eye, Globe, ExternalLink
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ProGate } from "@/components/ProGate";
import PageHeader from "@/components/PageHeader";

// --- Existing Data ---
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

// --- New Analytics Data ---
const GOVERNORATE_DATA = [
  { name: "بغداد", orders: 142, percentage: 35 },
  { name: "البصرة", orders: 58, percentage: 14 },
  { name: "أربيل", orders: 45, percentage: 11 },
  { name: "النجف", orders: 38, percentage: 9 },
  { name: "كربلاء", orders: 32, percentage: 8 },
  { name: "السليمانية", orders: 28, percentage: 7 },
  { name: "الموصل", orders: 22, percentage: 5 },
  { name: "ذي قار", orders: 18, percentage: 4 },
  { name: "أخرى", orders: 27, percentage: 7 },
];

const DEVICE_DATA = [
  { name: "موبايل", value: 68, icon: Smartphone, color: "hsl(191, 80%, 42%)" },
  { name: "كمبيوتر", value: 22, icon: Monitor, color: "hsl(160, 60%, 42%)" },
  { name: "تابلت", value: 10, icon: Tablet, color: "hsl(200, 85%, 52%)" },
];

const PAGE_VISITS = [
  { name: "قميص بولو كلاسيكي", visits: 1240, unique: 890 },
  { name: "حذاء رياضي نايك", visits: 980, unique: 720 },
  { name: "ساعة ذكية", visits: 856, unique: 640 },
  { name: "حقيبة جلدية", visits: 645, unique: 480 },
  { name: "نظارة شمسية", visits: 520, unique: 390 },
  { name: "سماعات بلوتوث", visits: 410, unique: 310 },
];

const TRAFFIC_SOURCES = [
  { name: "Facebook", value: 38, color: "#1877F2", emoji: "📘" },
  { name: "Instagram", value: 27, color: "#E4405F", emoji: "📸" },
  { name: "مباشر", value: 18, color: "hsl(191, 80%, 42%)", emoji: "🔗" },
  { name: "Google", value: 11, color: "#34A853", emoji: "🔍" },
  { name: "TikTok", value: 4, color: "#010101", emoji: "🎵" },
  { name: "أخرى", value: 2, color: "hsl(200, 12%, 48%)", emoji: "🌐" },
];

const PIE_COLORS = ["#1877F2", "#E4405F", "hsl(191, 80%, 42%)", "#34A853", "#010101", "hsl(200, 12%, 48%)"];

const PERIODS = ["اليوم", "هذا الأسبوع", "هذا الشهر", "هذه السنة"];

const Stats = () => {
  const [period, setPeriod] = useState("هذا الأسبوع");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<"governorate" | "device" | "pages" | "sources">("governorate");
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

  const analyticsTabs = [
    { id: "governorate" as const, label: "المحافظات", icon: MapPin },
    { id: "device" as const, label: "الأجهزة", icon: Smartphone },
    { id: "pages" as const, label: "الزيارات", icon: Eye },
    { id: "sources" as const, label: "المصادر", icon: Globe },
  ];

  const totalVisits = PAGE_VISITS.reduce((s, p) => s + p.visits, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="الإحصائيات" subtitle="تقارير الأداء والمبيعات" />

      <main className="container mx-auto px-4 space-y-5">
        {/* Period Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${period === p ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {p}
            </button>
          ))}
        </div>

        {/* Balance */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground">الرصيد المتاح للسحب</p>
            <p className="text-lg font-bold text-foreground">{availableBalance.toLocaleString("ar-IQ")} <span className="text-[10px] text-muted-foreground">د.ع</span></p>
          </div>
          <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 rounded-lg"><Wallet className="h-4 w-4" />طلب سحب</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] rounded-2xl">
              <DialogHeader><DialogTitle className="text-center">طلب سحب أرباح</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="bg-secondary/50 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">الرصيد المتاح</p>
                  <p className="text-xl font-bold text-foreground">{availableBalance.toLocaleString("ar-IQ")} <span className="text-xs text-muted-foreground">د.ع</span></p>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">المبلغ المطلوب (د.ع)</label>
                  <Input type="number" placeholder="أدخل المبلغ" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="text-center text-lg font-bold" />
                </div>
                <Button onClick={handleWithdraw} className="w-full gap-2 rounded-lg"><CheckCircle2 className="h-4 w-4" />تأكيد طلب السحب</Button>
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
              <span className="text-lg font-bold text-foreground block">{stat.value}{stat.sub && <span className="text-[10px] text-muted-foreground mr-1">{stat.sub}</span>}</span>
              <span className="text-[11px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

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
            <div className="p-4 pb-3"><h3 className="text-sm font-semibold text-foreground">أكثر المنتجات مبيعاً</h3></div>
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

          {/* ===== ADVANCED ANALYTICS SECTION ===== */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">تحليلات متقدمة</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-3">
              {analyticsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAnalyticsTab(tab.id)}
                  className={`flex items-center gap-1.5 flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeAnalyticsTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Governorates */}
            {activeAnalyticsTab === "governorate" && (
              <div className="bg-card border border-border rounded-2xl overflow-hidden animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="p-4 pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">الطلبات حسب المحافظة</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">توزيع الطلبات الجغرافي</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg px-2.5 py-1">
                      <span className="text-[11px] font-bold text-primary">{GOVERNORATE_DATA.reduce((s, g) => s + g.orders, 0)} طلب</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  {GOVERNORATE_DATA.map((gov, i) => (
                    <div key={gov.name} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            i === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}>{i + 1}</span>
                          <span className="text-xs font-medium text-foreground">{gov.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">{gov.orders} طلب</span>
                          <span className="text-[11px] font-bold text-foreground w-8 text-left">{gov.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            i === 0 ? "bg-primary" : i === 1 ? "bg-primary/70" : "bg-primary/40"
                          }`}
                          style={{ width: `${gov.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Devices */}
            {activeAnalyticsTab === "device" && (
              <div className="bg-card border border-border rounded-2xl overflow-hidden animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="p-4 pb-3 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">نوع الأجهزة</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">الأجهزة المستخدمة لتصفح المتجر</p>
                </div>

                <div className="p-4">
                  {/* Donut Chart */}
                  <div className="flex items-center justify-center mb-5">
                    <div className="relative">
                      <PieChart width={180} height={180}>
                        <Pie
                          data={DEVICE_DATA}
                          cx={90}
                          cy={90}
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {DEVICE_DATA.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Smartphone className="h-5 w-5 text-primary mb-0.5" />
                        <span className="text-lg font-bold text-foreground">68%</span>
                        <span className="text-[9px] text-muted-foreground">موبايل</span>
                      </div>
                    </div>
                  </div>

                  {/* Device Breakdown */}
                  <div className="space-y-3">
                    {DEVICE_DATA.map((device) => {
                      const Icon = device.icon;
                      return (
                        <div key={device.name} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${device.color}15` }}>
                            <Icon className="h-4 w-4" style={{ color: device.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-foreground">{device.name}</span>
                              <span className="text-xs font-bold text-foreground">{device.value}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${device.value}%`, backgroundColor: device.color }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Page Visits */}
            {activeAnalyticsTab === "pages" && (
              <div className="bg-card border border-border rounded-2xl overflow-hidden animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="p-4 pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">زيارات صفحات المنتجات</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">أكثر الصفحات زيارة</p>
                    </div>
                    <div className="bg-success/10 rounded-lg px-2.5 py-1">
                      <span className="text-[11px] font-bold text-success">{totalVisits.toLocaleString("ar-IQ")} زيارة</span>
                    </div>
                  </div>
                </div>

                {/* Bar chart for visits */}
                <div className="p-4 pb-2">
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PAGE_VISITS.slice(0, 5)} layout="vertical" margin={{ left: 0, right: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                        <Tooltip
                          contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(200, 20%, 90%)" }}
                          formatter={(value: number) => [`${value.toLocaleString("ar-IQ")} زيارة`]}
                        />
                        <Bar dataKey="visits" fill="hsl(191, 80%, 42%)" radius={[0, 6, 6, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {PAGE_VISITS.map((page, i) => (
                    <div key={page.name} className="flex items-center gap-3 px-4 py-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        i === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{page.name}</p>
                        <p className="text-[10px] text-muted-foreground">{page.unique.toLocaleString("ar-IQ")} زائر فريد</p>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <p className="text-xs font-bold text-foreground">{page.visits.toLocaleString("ar-IQ")}</p>
                        <p className="text-[10px] text-muted-foreground">زيارة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Traffic Sources */}
            {activeAnalyticsTab === "sources" && (
              <div className="bg-card border border-border rounded-2xl overflow-hidden animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="p-4 pb-3 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">مصادر الزيارات</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">من أين يأتي زبائنك</p>
                </div>

                {/* Pie Chart */}
                <div className="flex items-center justify-center py-4">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={TRAFFIC_SOURCES}
                      cx={100}
                      cy={100}
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {TRAFFIC_SOURCES.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(200, 20%, 90%)" }}
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </div>

                {/* Source Breakdown */}
                <div className="px-4 pb-4 space-y-2">
                  {TRAFFIC_SOURCES.map((source) => (
                    <div key={source.name} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${source.color}12` }}>
                        {source.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">{source.name}</span>
                          <span className="text-xs font-bold text-foreground">{source.value}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${source.value}%`, backgroundColor: source.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ProGate>
      </main>
    </div>
  );
};

export default Stats;
