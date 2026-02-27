import { 
  Store, UserCog, Palette, Truck, Activity, Ticket,
  BarChart3, Settings, HelpCircle, ChevronLeft, User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "إدارة المتجر",
    items: [
      { icon: Store, label: "المتاجر", path: "/stores", desc: "إنشاء وإدارة متاجرك" },
      { icon: UserCog, label: "فريق العمل", path: "/team", desc: "إضافة مديرين وصلاحيات" },
      { icon: Ticket, label: "أكواد الخصم", path: "/coupons", desc: "إنشاء وإدارة كوبونات" },
      { icon: Palette, label: "القوالب", path: "/templates", desc: "تغيير تصميم المتجر" },
    ],
  },
  {
    title: "الربط والتكامل",
    items: [
      { icon: Truck, label: "شركات التوصيل", path: "/delivery", desc: "ربط مع شركات التوصيل" },
      { icon: Activity, label: "البيكسل والتتبع", path: "/tracking", desc: "فيسبوك بيكسل، Google Analytics" },
    ],
  },
  {
    title: "عام",
    items: [
      { icon: BarChart3, label: "الإحصائيات", path: "/stats", desc: "تقارير المبيعات والأداء" },
      { icon: User, label: "حسابي", path: "/profile", desc: "إعدادات الحساب" },
      { icon: Settings, label: "الإعدادات", path: "/profile", desc: "الإشعارات، اللغة، المظهر" },
      { icon: HelpCircle, label: "المساعدة", path: "/profile", desc: "الدعم الفني" },
    ],
  },
];

const More = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-10 pb-4">
        <h1 className="text-xl font-bold text-foreground">المزيد</h1>
      </div>

      <main className="container mx-auto px-4 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-1">{section.title}</h2>
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-right hover:bg-muted/50 transition-colors"
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
          </div>
        ))}
      </main>
    </div>
  );
};

export default More;
