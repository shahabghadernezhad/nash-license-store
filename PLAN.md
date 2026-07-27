# 🎯 Nash-Security License Store — طرح کامل پروژه

**هدف:** فروشگاه آنلاین خرید و فروش لایسنس نرم‌افزار امنیتی Nash-Security  
**آدرس ریپو:** https://github.com/shahabatomic/nash-license-store  
**زبان:** فارسی (کاملاً RTL)

---

## 📐 معماری کلی

```
┌─────────────────────────────────────────────────────────┐
│                     DNS / Domain                         │
│                    license.nash-security.com              │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   Nginx / Caddy (HTTPS)                   │
│              Reverse Proxy + SSL Termination              │
└─────────┬──────────────────────────┬─────────────────────┘
          │                          │
┌─────────▼──────────┐   ┌──────────▼────────────────┐
│    Backend (8000)   │   │   Frontend (5173)          │
│    Django REST API  │   │   React + Vite             │
│    JWT Auth         │   │   Recharts (نمودار)        │
│    ZarinPal Gateway │   │   Tailwind (تم تیره)       │
│    SQLite/Postgres  │   │   RTL فارسی               │
└─────────┬───────────┘   └───────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────┐
│                   Email (SMTP)                          │
│           ارسال خودکار لایسنس به ایمیل مشتری              │
└───────────────────────────────────────────────────────┘
```

---

## 📦 ماژول‌های بک‌اند

### ۱. ماژول محصولات (`products/`)
| مدل | فیلدها |
|-----|--------|
| **Product** | name, slug, description, price_toman, duration_days, max_cameras, features (JSON), is_active, created_at |

**API:**
- `GET /api/products/` — لیست محصولات فعال
- `GET /api/products/{slug}/` — جزئیات محصول
- `POST /api/products/` — ایجاد (Admin)
- `PUT /api/products/{id}/` — ویرایش (Admin)

---

### ۲. ماژول سفارشات (`orders/`)
| مدل | فیلدها |
|-----|--------|
| **Order** | user_name, user_email, user_phone, product (FK), amount_toman, status (pending/paid/failed/cancelled), zarinpal_authority, zarinpal_ref_id, created_at, paid_at |

**جریان پرداخت:**
```
مشتری → انتخاب محصول → POST /api/orders/create/
                         ↓
           دریافت ZarinPal Payment URL
                         ↓
           انتقال به درگاه زرین‌پال
                         ↓
           پرداخت موفق ← بازگشت به Callback
                         ↓
           تولید خودکار لایسنس
                         ↓
           ارسال ایمیل + نمایش لایسنس
```

**API:**
- `POST /api/orders/create/` — ایجاد سفارش + دریافت لینک پرداخت
- `GET /api/orders/payment/callback/?Authority=xxx&Status=OK` — بازگشت از زرین‌پال
- `GET /api/orders/` — لیست سفارشات (Admin)
- `GET /api/orders/{id}/` — جزئیات سفارش

---

### ۳. ماژول لایسنس (`licenses/`)
| مدل | فیلدها |
|-----|--------|
| **License** | order (OneToOne), license_key (unique), product_name, user_email, hardware_fingerprint (nullable), is_active, activated_at, expires_at, created_at |
| **LicenseLog** | license (FK), action, detail, created_at |

**الگوریتم تولید لایسنس:**
```
KEY = HMAC-SHA256(secret, f"{order_id}:{user_email}:{product_id}")
LICENSE = "NSEC-" + KEY[:20].upper()
     مثال: NSEC-A7F3B9C2D1E4F5G6H7I8
```

**API:**
- `POST /api/licenses/verify/` — بررسی اعتبار لایسنس (بدون احراز)
- `POST /api/licenses/activate/` — فعال‌سازی روی دستگاه (با hardware fingerprint)
- `GET /api/licenses/` — لیست لایسنس‌ها (Admin)
- `GET /api/licenses/{id}/` — جزئیات لایسنس

---

### ۴. ماژول داشبورد (`dashboard/`)

**API:**
- `GET /api/dashboard/stats/` — آمار کلی
  ```json
  {
    "total_sales": 150,
    "total_revenue": 250000000,
    "active_licenses": 120,
    "today_sales": 5,
    "recent_orders": [...],
    "daily_revenue": [{"date": "1403-04-15", "revenue": 5000000}, ...],
    "top_products": [{"name": "پکیج ۴ دوربین", "sales": 89}, ...],
    "license_stats": {"active": 120, "expired": 30, "pending": 15}
  }
  ```

---

### ۵. ماژول احراز هویت (`auth/`)
- `POST /api/auth/login/` — ورود با username + password → JWT token
- `GET /api/auth/profile/` — پروفایل کاربر
- `POST /api/auth/refresh/` — تمدید توکن

---

## 🎨 ماژول‌های فرانت‌آماده

### ۱. صفحه ورود (`/login`)
- فرم ورود ادمین با تم تیره
- ذخیره JWT در localStorage

### ۲. داشبورد اصلی (`/`) ← **مهم‌ترین صفحه**
۴ عدد کارت آمار در بالا با انیمیشن شمارنده:
| کارت | داده |
|------|------|
| 💰 **مجموع فروش** | تعداد سفارشات پرداخت شده |
| 💵 **درآمد کل** | مجموع مبلغ به تومان |
| 🔑 **لایسنس فعال** | تعداد لایسنس‌های معتبر |
| 📈 **فروش امروز** | تعداد فروش امروز |

۴ نمودار:
| نمودار | نوع | توضیح |
|--------|-----|-------|
| 📊 **روند فروش ۳۰ روز** | Line/Area Chart | درآمد روزانه |
| 🏆 **پرفروش‌ترین محصولات** | Bar Chart | ۵ محصول برتر |
| 🥧 **وضعیت لایسنس‌ها** | Pie Chart | فعال/منقضی/در انتظار |
| 📋 **آخرین سفارشات** | Table | ۱۰ سفارش آخر |

### ۳. مدیریت محصولات (`/products`)
- جدول محصولات با قابلیت ایجاد/ویرایش/حذف
- Modal برای ایجاد محصول جدید

### ۴. مدیریت سفارشات (`/orders`)
- جدول سفارشات با وضعیت (پرداخت شده/در انتظار/لغو شده)
- فیلتر بر اساس وضعیت
- جستجو

### ۵. مدیریت لایسنس‌ها (`/licenses`)
- جدول لایسنس‌ها با وضعیت فعال/منقضی
- نمایش کلید لایسنس با دکمه کپی

### ۶. تنظیمات (`/settings`)
- تنظیمات فروشگاه
- اطلاعات پرداخت

---

## 💳 زرین‌پال — Payment Flow

```
1. مشتری محصول را انتخاب می‌کند
2. POST /api/orders/create/ → دریافت authority + payment_url
3. انتقال به: https://www.zarinpal.com/pg/StartPay/{authority}
4. مشتری در درگاه پرداخت می‌کند
5. بازگشت به: /api/orders/payment/callback/?Authority=xxx&Status=OK
6. بک‌اند:
   a. Verify با زرین‌پال
   b. تغییر status به paid
   c. تولید لایسنس (HMAC-SHA256)
   d. ارسال ایمیل با لایسنس
7. ریدایرکت به صفحه موفقیت (license-key=NSEC-...)
```

---

## 📧 ایمیل خودکار

بعد از پرداخت موفق، ایمیل شامل:
- نام محصول خریداری شده
- **کلید لایسنس**
- تاریخ انقضا
- لینک دانلود نرم‌افزار
- راهنمای فعال‌سازی

---

## 🚀 مراحل پیاده‌سازی

| فاز | کارها | زمان تخمینی |
|-----|-------|------------|
| **فاز ۱** | بک‌اند کامل (مدل‌ها + API + زرین‌پال) | ۲ روز |
| **فاز ۲** | فرانت‌آماده (داشبورد + صفحات) | ۲ روز |
| **فاز ۳** | ایمیل خودکار + مستندات | ۱ روز |
| **فاز ۴** | تست + رفع باگ | ۱ روز |
| **فاز ۵** | Deploy روی سرور | ۱ روز |

---

## 📂 ساختار نهایی پروژه

```
nash-license-store/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── store/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── products/
│   │   ├── models.py, views.py, serializers.py, urls.py, admin.py
│   ├── orders/
│   │   ├── models.py, views.py, serializers.py, urls.py, admin.py
│   ├── licenses/
│   │   ├── models.py, views.py, urls.py, admin.py, generator.py
│   ├── dashboard/
│   │   ├── views.py, urls.py
│   └── auth/
│       ├── views.py, urls.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx, App.jsx, index.css
│       ├── context/AuthContext.jsx
│       ├── services/api.js
│       ├── components/
│       │   ├── Layout.jsx, Sidebar.jsx
│       │   ├── ui/ (Modal, Button, Badge, Table, Skeleton)
│       └── pages/
│           ├── LoginPage.jsx
│           ├── DashboardPage.jsx
│           ├── ProductsPage.jsx
│           ├── OrdersPage.jsx
│           ├── LicensesPage.jsx
│           └── SettingsPage.jsx
├── .gitignore
├── .env.example
└── README.md
```

---

## 📊 API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | ورود ادمین |
| GET | `/api/auth/profile/` | پروفایل |
| GET | `/api/products/` | لیست محصولات |
| GET | `/api/products/{slug}/` | جزئیات محصول |
| POST | `/api/orders/create/` | ایجاد سفارش + لینک پرداخت |
| GET | `/api/orders/payment/callback/` | بازگشت از زرین‌پال |
| GET | `/api/orders/` | لیست سفارشات (Admin) |
| POST | `/api/licenses/verify/` | بررسی لایسنس |
| POST | `/api/licenses/activate/` | فعال‌سازی لایسنس |
| GET | `/api/licenses/` | لیست لایسنس‌ها (Admin) |
| GET | `/api/dashboard/stats/` | آمار داشبورد |
| GET | `/api/dashboard/revenue-chart/` | نمودار فروش |
| GET | `/api/dashboard/top-products/` | پرفروش‌ترین‌ها |
| GET | `/api/dashboard/license-stats/` | آمار لایسنس |
