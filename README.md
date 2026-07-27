# 🔐 Nash-Security License Store

فروشگاه آنلاین لایسنس نرم‌افزار امنیتی Nash-Security

## امکانات

- 🛒 فروش لایسنس آنلاین
- 💳 پرداخت از طریق زرین‌پال
- 📊 داشبورد ادمین با نمودار
- 🔑 تولید خودکار لایسنس
- 📧 ارسال لایسنس از طریق ایمیل
- 🔒 فعال‌سازی لایسنس روی دستگاه

## نصب و اجرا

### بک‌اند
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

### فرانت‌آماده
```bash
cd frontend
npm install
npm run dev
```

### دسترسی
- داشبورد: http://localhost:5173
- API: http://localhost:8000/api/
- ادمین: http://localhost:8000/admin/
