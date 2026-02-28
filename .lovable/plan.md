

## تحليل الوضع الحالي

الـ `StoreSwitcher` موجود حالياً في: **Home, Orders, Customers, Index (المخزون)** فقط.

الصفحات التالية **ما عندها** StoreSwitcher وتحتاجه لأن بياناتها مرتبطة بالمتجر:
- **Coupons** (أكواد الخصم)
- **Delivery** (شركات التوصيل)
- **Tracking** (البيكسل والتتبع)
- **Stats** (الإحصائيات)

صفحات **ما تحتاج** StoreSwitcher لأنها عامة:
- Profile, Plans, More, Team, Templates, Register

---

## الخطة

نعم نكدر ندخل تعدد المتاجر بكل مكان ونحافظ على البساطة. الطريقة هي:

### 1. إضافة StoreSwitcher compact للصفحات الناقصة
- **Coupons**: إضافته في `actions` prop الخاص بـ PageHeader بجانب زر "إنشاء كود"
- **Delivery**: نفس الشي بجانب زر "إضافة شركة"  
- **Tracking**: بجانب زر "إضافة بيكسل"
- **Stats**: في PageHeader كـ action

### 2. ربط بيانات الصفحة الرئيسية بالمتجر المختار
- في **Home.tsx**: عرض اسم المتجر ورابطه الفعلي (domain) في زر "فتح المتجر" بدل الرابط الثابت

### 3. المحافظة على البساطة
- **لا** نغير تصميم أو layout أي صفحة
- **لا** نضيف فلاتر إضافية - فقط الـ StoreSwitcher الموجود بنفس الستايل compact
- البيانات تبقى mock حالياً - مستقبلاً تتفلتر حسب المتجر المختار

---

## التغييرات بالملفات

| الملف | التغيير |
|---|---|
| `src/pages/Coupons.tsx` | import StoreSwitcher + إضافته بجانب زر الإنشاء في PageHeader actions |
| `src/pages/Delivery.tsx` | import StoreSwitcher + إضافته بجانب زر الإضافة في PageHeader actions |
| `src/pages/Tracking.tsx` | import StoreSwitcher + إضافته بجانب زر الإضافة في PageHeader actions |
| `src/pages/Stats.tsx` | import StoreSwitcher + إضافته في PageHeader actions |
| `src/pages/Home.tsx` | ربط زر "فتح المتجر" بدومين المتجر النشط من useStores |

