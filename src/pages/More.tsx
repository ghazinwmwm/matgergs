import { Store, User, BarChart3, Settings, HelpCircle, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: User, label: "حسابي", path: "/profile", desc: "إعدادات الحساب والملف الشخصي" },
  { icon: BarChart3, label: "الإحصائيات", path: "/stats", desc: "تقارير المبيعات والأداء" },
  { icon: Store, label: "إعدادات المتجر", path: "/profile", desc: "اسم المتجر، الشعار، الوصف" },
  { icon: Settings, label: "الإعدادات", path: "/profile", desc: "الإشعارات، اللغة، المظهر" },
  { icon: HelpCircle, label: "المساعدة", path: "/profile", desc: "الدعم الفني والأسئلة الشائعة" },
];

const More = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-10 pb-4">
        <h1 className="text-xl font-bold text-foreground">المزيد</h1>
      </div>

      <main className="container mx-auto px-4">
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-right hover:bg-muted/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronLeft className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default More;
