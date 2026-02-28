import { useState } from "react";
import { Plus, Trash2, Copy, Code, Eye, Facebook, Activity, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ProGate } from "@/components/ProGate";
import PageHeader from "@/components/PageHeader";

interface Pixel {
  id: string;
  name: string;
  platform: "facebook" | "tiktok" | "snapchat" | "google" | "custom";
  pixelId: string;
  active: boolean;
  events: string[];
}

const PLATFORM_INFO: Record<string, { label: string; icon: typeof Facebook; color: string }> = {
  facebook: { label: "فيسبوك بيكسل", icon: Facebook, color: "bg-blue-500/10 text-blue-600" },
  tiktok: { label: "تيك توك بيكسل", icon: Activity, color: "bg-pink-500/10 text-pink-600" },
  snapchat: { label: "سناب شات بيكسل", icon: Eye, color: "bg-yellow-500/10 text-yellow-600" },
  google: { label: "Google Analytics", icon: BarChart3, color: "bg-green-500/10 text-green-600" },
  custom: { label: "كود مخصص", icon: Code, color: "bg-muted text-muted-foreground" },
};

const MOCK_PIXELS: Pixel[] = [
  { id: "1", platform: "facebook", name: "فيسبوك الرئيسي", pixelId: "1234567890123456", active: true, events: ["PageView", "Purchase", "AddToCart"] },
  { id: "2", platform: "google", name: "Google Analytics", pixelId: "G-XXXXXXXXXX", active: true, events: ["page_view", "purchase"] },
];

const Tracking = () => {
  const [pixels, setPixels] = useState<Pixel[]>(MOCK_PIXELS);
  const [showForm, setShowForm] = useState(false);
  const [newPixel, setNewPixel] = useState({ platform: "facebook" as Pixel["platform"], name: "", pixelId: "" });

  const togglePixel = (id: string) => setPixels((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  const addPixel = () => {
    if (!newPixel.pixelId) return;
    const pixel: Pixel = { id: Date.now().toString(), ...newPixel, name: newPixel.name || PLATFORM_INFO[newPixel.platform].label, active: true, events: ["PageView"] };
    setPixels((prev) => [pixel, ...prev]);
    setNewPixel({ platform: "facebook", name: "", pixelId: "" });
    setShowForm(false);
  };
  const deletePixel = (id: string) => setPixels((prev) => prev.filter((p) => p.id !== id));
  const copyId = (id: string) => { navigator.clipboard.writeText(id); toast({ title: "تم النسخ" }); };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="البيكسل والتتبع"
        subtitle={`${pixels.length} بيكسل`}
        actions={
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            إضافة بيكسل
          </Button>
        }
      />

      <main className="container mx-auto px-4 space-y-4">
        <ProGate feature="البيكسل وأدوات التتبع والتحليلات">
          {showForm && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-slide-in">
              <h3 className="text-sm font-semibold text-foreground">إضافة بيكسل جديد</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">المنصة</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(PLATFORM_INFO) as Pixel["platform"][]).map((platform) => {
                    const info = PLATFORM_INFO[platform];
                    const Icon = info.icon;
                    return (
                      <button key={platform} onClick={() => setNewPixel({ ...newPixel, platform })} className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-[10px] font-medium border transition-colors ${newPixel.platform === platform ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                        <Icon className="h-4 w-4" />{info.label.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">الاسم (اختياري)</label>
                <Input value={newPixel.name} onChange={(e) => setNewPixel({ ...newPixel, name: e.target.value })} placeholder="اسم مخصص" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">معرّف البيكسل</label>
                <Input value={newPixel.pixelId} onChange={(e) => setNewPixel({ ...newPixel, pixelId: e.target.value })} placeholder="1234567890123456" dir="ltr" />
              </div>
              <div className="flex gap-2">
                <Button onClick={addPixel} size="sm" className="flex-1">إضافة</Button>
                <Button onClick={() => setShowForm(false)} variant="outline" size="sm">إلغاء</Button>
              </div>
            </div>
          )}

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Activity className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">ما هو البيكسل؟</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">البيكسل هو كود تتبع يُضاف لمتجرك لمعرفة سلوك الزوار وقياس فعالية الإعلانات.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {pixels.map((pixel) => {
              const info = PLATFORM_INFO[pixel.platform];
              const Icon = info.icon;
              return (
                <div key={pixel.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${info.color}`}><Icon className="h-5 w-5" /></div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{pixel.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-muted-foreground font-mono" dir="ltr">{pixel.pixelId}</span>
                          <button onClick={() => copyId(pixel.pixelId)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                        </div>
                      </div>
                    </div>
                    <Switch checked={pixel.active} onCheckedChange={() => togglePixel(pixel.id)} />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1">
                      {pixel.events.map((event) => (
                        <span key={event} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-mono">{event}</span>
                      ))}
                    </div>
                    <button onClick={() => deletePixel(pixel.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </ProGate>
      </main>
    </div>
  );
};

export default Tracking;
