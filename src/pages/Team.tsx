import { useState } from "react";
import { Plus, UserCog, Trash2, Shield, ShieldCheck, ShieldAlert, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProGate } from "@/components/ProGate";

interface Manager {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  store: string;
  addedAt: string;
  avatar?: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  owner: { label: "مالك", color: "bg-primary/10 text-primary", icon: ShieldCheck },
  admin: { label: "مدير", color: "bg-accent/10 text-accent-foreground", icon: ShieldAlert },
  editor: { label: "محرر", color: "bg-success/10 text-success", icon: Shield },
  viewer: { label: "مشاهد", color: "bg-muted text-muted-foreground", icon: Shield },
};

const MOCK_MANAGERS: Manager[] = [
  { id: "1", name: "أحمد محمد", email: "ahmed@example.com", role: "owner", store: "المتجر الرئيسي", addedAt: "2025-01-15" },
  { id: "2", name: "سارة علي", email: "sara@example.com", role: "admin", store: "المتجر الرئيسي", addedAt: "2025-06-20" },
  { id: "3", name: "عمر حسين", email: "omar@example.com", role: "editor", store: "فرع المنصور", addedAt: "2025-09-10" },
];

const Team = () => {
  const [managers, setManagers] = useState<Manager[]>(MOCK_MANAGERS);
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ email: "", role: "editor" as Manager["role"] });

  const sendInvite = () => {
    if (!invite.email) return;
    const manager: Manager = {
      id: Date.now().toString(),
      name: invite.email.split("@")[0],
      email: invite.email,
      role: invite.role,
      store: "المتجر الرئيسي",
      addedAt: new Date().toISOString().split("T")[0],
    };
    setManagers((prev) => [...prev, manager]);
    setInvite({ email: "", role: "editor" });
    setShowInvite(false);
  };

  const removeManager = (id: string) => {
    setManagers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-10 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">فريق العمل</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{managers.length} عضو</p>
          </div>
          <Button onClick={() => setShowInvite(!showInvite)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            دعوة
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 space-y-4">
        <ProGate feature="إدارة فريق العمل وإضافة مديرين">
          {showInvite && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-slide-in">
              <h3 className="text-sm font-semibold text-foreground">دعوة مدير جديد</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">البريد الإلكتروني</label>
                <Input type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder="email@example.com" dir="ltr" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">الصلاحية</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["admin", "editor", "viewer"] as const).map((role) => (
                    <button key={role} onClick={() => setInvite({ ...invite, role })} className={`py-2 rounded-lg text-xs font-medium border transition-colors ${invite.role === role ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                      {ROLE_LABELS[role].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={sendInvite} size="sm" className="flex-1 gap-1.5"><Mail className="h-3.5 w-3.5" />إرسال الدعوة</Button>
                <Button onClick={() => setShowInvite(false)} variant="outline" size="sm">إلغاء</Button>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">الصلاحيات</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ROLE_LABELS).map(([key, { label, color }]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {key === "owner" && "تحكم كامل"}
                    {key === "admin" && "إدارة كل شيء"}
                    {key === "editor" && "تعديل المنتجات"}
                    {key === "viewer" && "عرض فقط"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {managers.map((manager) => {
              const roleInfo = ROLE_LABELS[manager.role];
              return (
                <div key={manager.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{manager.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{manager.name}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleInfo.color}`}>{roleInfo.label}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{manager.email}</p>
                    <p className="text-[10px] text-muted-foreground">{manager.store}</p>
                  </div>
                  {manager.role !== "owner" && (
                    <button onClick={() => removeManager(manager.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </ProGate>
      </main>
    </div>
  );
};

export default Team;
