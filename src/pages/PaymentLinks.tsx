import { useState } from "react";
import {
  Link2, Plus, Copy, Trash2, Check, ExternalLink,
  DollarSign, FileText, Share2, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";

interface PaymentLink {
  id: string;
  title: string;
  amount: number;
  description: string;
  createdAt: string;
}

const STORAGE_KEY = "matager_payment_links";

const loadLinks = (): PaymentLink[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveLinks = (links: PaymentLink[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
};

const PaymentLinks = () => {
  const [links, setLinks] = useState<PaymentLink[]>(loadLinks);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateLink = (link: PaymentLink) => {
    return `${window.location.origin}/pay/${link.id}`;
  };

  const handleCreate = () => {
    if (!title.trim() || !amount.trim()) {
      toast({ title: "أدخل العنوان والمبلغ", variant: "destructive" });
      return;
    }
    const newLink: PaymentLink = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: title.trim(),
      amount: Number(amount),
      description: description.trim(),
      createdAt: new Date().toLocaleDateString("ar-IQ"),
    };
    const updated = [newLink, ...links];
    setLinks(updated);
    saveLinks(updated);
    setTitle("");
    setAmount("");
    setDescription("");
    setShowForm(false);
    toast({ title: "✓ تم إنشاء رابط الدفع" });
  };

  const handleDelete = (id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    saveLinks(updated);
    toast({ title: "تم حذف الرابط" });
  };

  const handleCopy = (link: PaymentLink) => {
    const url = generateLink(link);
    navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "✓ تم نسخ الرابط" });
  };

  const handleShareWhatsApp = (link: PaymentLink) => {
    const url = generateLink(link);
    const text = `${link.title}\n💰 المبلغ: ${link.amount.toLocaleString("ar-IQ")} د.ع\n${link.description ? `📝 ${link.description}\n` : ""}🔗 ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir="rtl">
      <PageHeader title="روابط الدفع" subtitle="أنشئ روابط دفع سريعة وشاركها مع عملائك" />

      <main className="container mx-auto max-w-lg px-4 space-y-4">

        {/* Create Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="w-full h-12 rounded-2xl gap-2 text-sm font-bold">
            <Plus className="h-4 w-4" /> إنشاء رابط دفع جديد
          </Button>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold text-foreground">رابط دفع جديد</p>
              <button onClick={() => setShowForm(false)} className="text-xs text-muted-foreground hover:text-foreground">إلغاء</button>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">عنوان الخدمة *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="مثال: تصميم شعار احترافي" className="h-11 rounded-xl" />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">المبلغ (د.ع) *</label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="50000" className="h-11 rounded-xl pr-9" type="text" inputMode="numeric" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">وصف (اختياري)</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="تفاصيل إضافية عن الخدمة..." className="min-h-[60px] rounded-xl resize-none text-sm" />
            </div>

            <Button onClick={handleCreate} className="w-full h-11 rounded-xl gap-2 text-sm font-bold">
              <Link2 className="h-4 w-4" /> إنشاء الرابط
            </Button>
          </div>
        )}

        {/* Links List */}
        {links.length === 0 && !showForm && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Link2 className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1">لا توجد روابط دفع</p>
            <p className="text-xs text-muted-foreground">أنشئ رابط دفع وشاركه مع عميلك عبر واتساب أو أي وسيلة</p>
          </div>
        )}

        {links.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground px-1">روابطك ({links.length})</p>
            {links.map(link => (
              <div key={link.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{link.title}</h3>
                    {link.description && (
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{link.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mr-2 flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{link.amount.toLocaleString("ar-IQ")}</span>
                    <span className="text-[10px] text-muted-foreground">د.ع</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-muted/30 rounded-xl px-3 py-2">
                  <Link2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground truncate flex-1" dir="ltr">{generateLink(link)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={() => handleCopy(link)} variant="outline" size="sm"
                    className="flex-1 h-9 rounded-xl gap-1.5 text-xs font-semibold">
                    {copiedId === link.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    {copiedId === link.id ? "تم النسخ" : "نسخ"}
                  </Button>
                  <Button onClick={() => handleShareWhatsApp(link)} variant="outline" size="sm"
                    className="flex-1 h-9 rounded-xl gap-1.5 text-xs font-semibold">
                    <MessageCircle className="h-3 w-3" /> واتساب
                  </Button>
                  <button onClick={() => handleDelete(link.id)}
                    className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="text-[9px] text-muted-foreground text-left">{link.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentLinks;
