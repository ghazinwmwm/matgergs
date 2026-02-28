import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/hooks/useLanguage";

const WEEKLY_DATA_AR = [
  { day: "السبت", sales: 320000 },
  { day: "الأحد", sales: 450000 },
  { day: "الاثنين", sales: 280000 },
  { day: "الثلاثاء", sales: 520000 },
  { day: "الأربعاء", sales: 390000 },
  { day: "الخميس", sales: 610000 },
  { day: "الجمعة", sales: 480000 },
];

const WEEKLY_DATA_KU = [
  { day: "شەممە", sales: 320000 },
  { day: "یەکشەممە", sales: 450000 },
  { day: "دووشەممە", sales: 280000 },
  { day: "سێشەممە", sales: 520000 },
  { day: "چوارشەممە", sales: 390000 },
  { day: "پێنجشەممە", sales: 610000 },
  { day: "هەینی", sales: 480000 },
];

const SalesChart = () => {
  const { t, lang } = useLanguage();
  const data = lang === "ku" ? WEEKLY_DATA_KU : WEEKLY_DATA_AR;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h2 className="text-sm font-semibold text-foreground mb-4">{t.home.weeklySales}</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(191, 80%, 42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(191, 80%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 90%)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(200, 12%, 48%)" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(200, 12%, 48%)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(200, 20%, 90%)", borderRadius: 8, fontSize: 12 }}
              formatter={(value: number) => [`${value.toLocaleString("ar-IQ")} ${t.currency}`, t.home.revenue]}
            />
            <Area type="monotone" dataKey="sales" stroke="hsl(191, 80%, 42%)" strokeWidth={2} fill="url(#salesGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
