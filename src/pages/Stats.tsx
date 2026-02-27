import { BarChart3 } from "lucide-react";

const Stats = () => (
  <div className="min-h-screen bg-background pb-28">
    <div className="container mx-auto px-4 pt-12 pb-8">
      <h1 className="text-2xl font-bold text-foreground">الإحصائيات</h1>
      <p className="text-sm text-muted-foreground mt-1">قريباً...</p>
    </div>
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
      <BarChart3 className="h-14 w-14 mb-3 opacity-30" />
      <p className="text-base font-medium">قريباً</p>
    </div>
  </div>
);

export default Stats;
