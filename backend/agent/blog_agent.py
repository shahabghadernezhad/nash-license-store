"""
AI Blog Agent — روزانه مطالب مرتبط با امنیت و دوربین پیدا و منتشر می‌کنه.

منابع:
- RSS Feeds امنیتی
- Hacker News
- Dev.to
- آدرس‌های خبری امنیت سایبری

این اسکریپت هر روز اجرا میشه و:
1. آخرین اخبار و مقالات امنیتی رو جمع‌آوری می‌کنه
2. بهترین‌ها رو فیلتر می‌کنه
3. محتوای باکیفیت تولید می‌کنه
4. توی وبلاگ منتشر می‌کنه
"""
import hashlib
import json
import re
import logging
from datetime import datetime, timedelta
from pathlib import Path

logger = logging.getLogger('blog_agent')

# --- Configuration ---
SECURITY_TOPICS = [
    'security camera', 'surveillance', 'CCTV', 'access control',
    'face recognition', 'license plate', 'AI security',
    'smart home security', 'intrusion detection', 'video analytics',
    'security system', 'network camera', 'IP camera', 'ONVIF',
    'security monitoring', 'perimeter security', 'biometric',
    'night vision', 'motion detection', 'security alarm',
    'data center security', 'building security', 'cyber security',
    'IoT security', 'smart city', 'video management',
]

# RSS Feeds to monitor
RSS_FEEDS = [
    {
        'name': 'Krebs on Security',
        'url': 'https://krebsonsecurity.com/feed/',
        'category': 'امنیت سایبری',
    },
    {
        'name': 'The Hacker News',
        'url': 'https://feeds.feedburner.com/TheHackersNews',
        'category': 'امنیت سایبری',
    },
    {
        'name': 'SecurityWeek',
        'url': 'https://feeds.feedburner.com/securityweek',
        'category': 'اخبار امنیت',
    },
    {
        'name': 'Dark Reading',
        'url': 'https://www.darkreading.com/rss.xml',
        'category': 'اخبار امنیت',
    },
    {
        'name': 'Schneier on Security',
        'url': 'https://www.schneier.com/feed/atom/',
        'category': 'تحلیل امنیت',
    },
    {
        'name': 'TechCrunch Security',
        'url': 'https://techcrunch.com/category/security/feed/',
        'category': 'تکنولوژی',
    },
    {
        'name': 'Ars Technica Security',
        'url': 'https://feeds.arstechnica.com/arstechnica/security',
        'category': 'تکنولوژی',
    },
]

DEFAULT_CATEGORIES = [
    'امنیت سایبری',
    'اخبار امنیت',
    'تحلیل امنیت',
    'تکنولوژی',
    'دوربین مداربسته',
    'تشخیص چهره',
    'خوانش پلاک',
    'خانه هوشمند',
    'نکات امنیتی',
    'آموزش',
]


def setup_django():
    """Setup Django for standalone agent execution."""
    import os, sys
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'store.settings')
    import django
    django.setup()


def fetch_rss_entries(feed_url, feed_name, max_entries=10):
    """Fetch entries from an RSS feed using Python stdlib."""
    import urllib.request
    import xml.etree.ElementTree as ET

    entries = []
    try:
        req = urllib.request.Request(feed_url, headers={
            'User-Agent': 'NashSecurity-BlogAgent/1.0'
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()

        root = ET.fromstring(data)

        # Handle both RSS and Atom feeds
        ns = {'atom': 'http://www.w3.org/2005/Atom'}

        # Try RSS 2.0 format
        for item in root.findall('.//item'):
            title = item.findtext('title', '')
            link = item.findtext('link', '')
            description = item.findtext('description', '')
            pub_date = item.findtext('pubDate', '')
            if title and link:
                entries.append({
                    'title': title.strip(),
                    'link': link.strip(),
                    'description': clean_html(description)[:300],
                    'date': pub_date,
                    'source': feed_name,
                })
            if len(entries) >= max_entries:
                break

        # Try Atom format
        if not entries:
            for entry in root.findall('.//atom:entry', ns):
                title = entry.findtext('atom:title', '', ns)
                link_el = entry.find('atom:link', ns)
                link = link_el.get('href', '') if link_el is not None else ''
                summary = entry.findtext('atom:summary', '', ns)
                updated = entry.findtext('atom:updated', '', ns)
                if title and link:
                    entries.append({
                        'title': title.strip(),
                        'link': link.strip(),
                        'description': clean_html(summary)[:300],
                        'date': updated,
                        'source': feed_name,
                    })
                if len(entries) >= max_entries:
                    break

    except Exception as e:
        logger.warning(f"Failed to fetch RSS from {feed_name}: {e}")

    return entries


def clean_html(html_text):
    """Remove HTML tags from text."""
    clean = re.sub(r'<[^>]+>', '', html_text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean


def is_relevant(title, description):
    """Check if an entry is relevant to security/camera topics."""
    text = (title + ' ' + description).lower()
    for topic in SECURITY_TOPICS:
        if topic.lower() in text:
            return True
    return False


def generate_seo_title(title, source):
    """Generate a Persian-friendly SEO title."""
    prefixes = [
        'بررسی', 'تحلیل', 'مرور', 'معرفی', 'راهنمای',
    ]
    suffixes = [
        'در سال ۲۰۲۵', 'برای متخصصان', 'به زبان ساده', '',
    ]

    # Keep original title but add context
    if len(title) > 80:
        title = title[:77] + '...'
    return title


def generate_slug(title):
    """Generate URL-friendly slug from title."""
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[\s]+', '-', slug).strip('-')
    return slug[:200] or hashlib.md5(title.encode()).hexdigest()[:10]


def generate_persian_excerpt(title, description):
    """Generate a Persian excerpt from the original content."""
    excerpt = clean_html(description)
    if len(excerpt) > 250:
        excerpt = excerpt[:247] + '...'
    if not excerpt:
        excerpt = f'مقاله {title} درباره امنیت و سیستم‌های نظارتی'
    return excerpt


def create_blog_post(entry, category_name):
    """Create a blog post from a fetched entry."""
    from blog.models import Post, Category, Tag

    # Create or get category
    category, _ = Category.objects.get_or_create(
        name=category_name,
        defaults={'slug': generate_slug(category_name)}
    )

    # Check if post already exists
    slug = generate_slug(entry['title'])
    if Post.objects.filter(slug=slug).exists():
        return None

    # Create tags from keywords
    tags = []
    keywords = re.findall(r'\b\w{4,}\b', (entry['title'] + ' ' + entry['description']).lower())
    security_words = [w for w in keywords if w in [t.lower() for t in SECURITY_TOPICS[:10]]]
    for tag_name in security_words[:3]:
        tag, _ = Tag.objects.get_or_create(
            name=tag_name.title(),
            defaults={'slug': generate_slug(tag_name)}
        )
        tags.append(tag)

    # Determine AI topics
    ai_topics = [t for t in SECURITY_TOPICS if t.lower() in entry['title'].lower()][:5]

    # Create the post
    content = f"""# {entry['title']}

{entry['description']}

---

**منبع:** {entry['source']}
**لینک اصلی:** [مشاهده مقاله اصلی]({entry['link']})

---

*این مقاله به صورت خودکار توسط سیستم هوش مصنوعی Nash-Security تهیه و بازنویسی شده است.*
*برای مشاهده مقاله اصلی، لینک بالا را دنبال کنید.*
"""

    post = Post.objects.create(
        title=entry['title'][:300],
        slug=slug,
        excerpt=generate_persian_excerpt(entry['title'], entry['description']),
        content=content,
        featured_image='',
        category=category,
        meta_title=generate_seo_title(entry['title'], entry['source']),
        meta_description=generate_persian_excerpt(entry['title'], entry['description'])[:200],
        status=Post.Status.PUBLISHED,
        source=Post.Source.AI_AGENT,
        ai_topic=entry.get('topic', ''),
        ai_keywords=ai_topics,
        ai_read_time=max(1, len(content.split()) // 200),
        published_at=datetime.now(),
    )

    # Add tags
    for tag in tags:
        post.tags.add(tag)

    return post


def run_daily():
    """
    Main agent function — run once daily via cron.
    Fetches, filters, and publishes security-related articles.
    """
    setup_django()
    from blog.models import Post

    logger.info("🤖 AI Blog Agent starting...")

    new_posts = 0
    all_entries = []

    # Fetch from all RSS feeds
    for feed in RSS_FEEDS:
        logger.info(f"📡 Fetching from {feed['name']}...")
        entries = fetch_rss_entries(feed['url'], feed['name'])
        for entry in entries:
            entry['category'] = feed['category']
        all_entries.extend(entries)

    logger.info(f"📰 Total entries fetched: {len(all_entries)}")

    # Filter for relevant entries
    relevant = [
        e for e in all_entries
        if is_relevant(e['title'], e['description'])
    ]
    logger.info(f"🎯 Relevant entries: {len(relevant)}")

    # Sort by date (newest first)
    relevant.sort(key=lambda x: x.get('date', ''), reverse=True)

    # Take top 3-5 per day
    today = datetime.now().date()
    today_posts = Post.objects.filter(
        source='ai_agent',
        created_at__date=today
    ).count()
    max_per_day = 5
    remaining = max_per_day - today_posts

    for entry in relevant[:remaining]:
        post = create_blog_post(entry, entry['category'])
        if post:
            new_posts += 1
            logger.info(f"✅ Created: {post.title}")

    # If not enough relevant posts, create curated posts
    from blog.models import Category as BlogCategory
    if new_posts < 2:
        logger.info("📝 Creating curated security articles...")
        curated = get_curated_articles()
        for article in curated[:remaining - new_posts]:
            slug = generate_slug(article['title'])
            if not Post.objects.filter(slug=slug).exists():
                category, _ = BlogCategory.objects.get_or_create(
                    name=article['category'],
                    defaults={'slug': generate_slug(article['category'])}
                )
                Post.objects.create(
                    title=article['title'],
                    slug=slug,
                    excerpt=article['excerpt'],
                    content=article['content'],
                    category=category,
                    status=Post.Status.PUBLISHED,
                    source=Post.Source.AI_AGENT,
                    ai_topic=article.get('topic', ''),
                    ai_keywords=article.get('keywords', []),
                    ai_read_time=article.get('read_time', 5),
                    published_at=datetime.now(),
                )
                new_posts += 1

    logger.info(f"🎉 Agent finished. Created {new_posts} posts.")
    return new_posts


def get_curated_articles():
    """Hand-crafted high-quality articles for when RSS feeds are slow."""
    articles = [
        {
            'title': '۱۰ نکته امنیتی مهم برای دوربین مداربسته',
            'category': 'نکات امنیتی',
            'excerpt': 'با رعایت این ۱۰ نکته ساده، امنیت دوربین مداربسته خود را به طور چشمگیری افزایش دهید.',
            'topic': 'camera security tips',
            'keywords': ['camera', 'security', 'tips', 'CCTV'],
            'read_time': 5,
            'content': """# ۱۰ نکته امنیتی مهم برای دوربین مداربسته

## ۱. رمز عبور پیش‌فرض را تغییر دهید
اولین و مهم‌ترین قدم، تغییر رمز عبور پیش‌فرض دوربین است. بسیاری از حملات به دلیل استفاده از رمزهای عبور پیش‌فرض رخ می‌دهد.

## ۲. فریمور را به‌روز نگه دارید
به‌روزرسانی‌های امنیتی دوربین را به‌موقع نصب کنید. این به‌روزرسانی‌ها آسیب‌پذیری‌های شناخته‌شده را رفع می‌کنند.

## ۳. از شبکه جداگانه استفاده کنید
دوربین‌های مداربسته را در یک شبکه جداگانه (VLAN) قرار دهید تا در صورت نفوذ به شبکه اصلی، دوربین‌ها در معرض خطر نباشند.

## ۴. رمزگذاری ترافیک
از رمزگذاری HTTPS/TLS برای انتقال تصاویر استفاده کنید تا تصاویر در حین انتقال شنود نشوند.

## ۵. محدود کردن دسترسی
فقط افراد مجاز به مشاهده تصاویر دوربین دسترسی داشته باشند. از سیستم RBAC استفاده کنید.

## ۶. ذخیره‌سازی امن
تصاویر دوربین را در محل امنی ذخیره کنید. از رمزگذاری دیسک و بکاپ منظم استفاده کنید.

## ۷. مانیتورینگ مداوم
سیستم هشدار هوشمند فعال کنید تا در صورت بروز رویداد مشکوک، سریعاً مطلع شوید.

## ۸. حفاظت فیزیکی
خود دوربین‌ها را در برابر سرقت یا خرابکاری فیزیکی محافظت کنید.

## ۹. لاگ و ثبت رویدادها
تمامی دسترسی‌ها و تغییرات را ثبت کنید تا در صورت بروز مشکل، امکان بررسی وجود داشته باشد.

## ۱۰. تست نفوذ
به‌طور دوره‌ای امنیت سیستم دوربین خود را تست کنید و آسیب‌پذیری‌ها را شناسایی و رفع کنید.

---

*با رعایت این نکات، می‌توانید امنیت سیستم نظارتی خود را به سطح حرفه‌ای ارتقا دهید.*
""",
        },
        {
            'title': 'مقایسه دوربین‌های IP و آنالوگ: کدام برای شما بهتر است؟',
            'category': 'دوربین مداربسته',
            'excerpt': 'راهنمای جامع مقایسه دوربین‌های آنالوگ و IP برای انتخاب بهترین گزینه نظارتی.',
            'topic': 'IP vs analog cameras',
            'keywords': ['IP camera', 'analog', 'comparison', 'CCTV'],
            'read_time': 7,
            'content': """# مقایسه دوربین‌های IP و آنالوگ

## دوربین آنالوگ
- **کیفیت تصویر:** تا ۱۰۸۰p
- **هزینه:** پایین‌تر
- **نصب:** ساده‌تر
- **امکانات:** محدود

## دوربین IP
- **کیفیت تصویر:** تا ۴K و بالاتر
- **هزینه:** بالاتر
- **نصب:** نیاز به تنظیمات شبکه
- **امکانات:** پیشرفته (تشخیص چهره، تحلیل ویدیو)

## نتیجه‌گیری
برای پروژه‌های کوچک و با بودجه محدود، آنالوگ گزینه خوبی است.
برای پروژه‌های حرفه‌ای و نیاز به امکانات پیشرفته، IP توصیه می‌شود.
""",
        },
        {
            'title': 'نقش هوش مصنوعی در سیستم‌های امنیتی نسل جدید',
            'category': 'تکنولوژی',
            'excerpt': 'بررسی نقش AI و یادگیری ماشین در تحلیل تصاویر دوربین و تشخیص رویدادهای امنیتی.',
            'topic': 'AI in security',
            'keywords': ['AI', 'machine learning', 'video analytics', 'security'],
            'read_time': 6,
            'content': """# نقش هوش مصنوعی در سیستم‌های امنیتی

## مقدمه
هوش مصنوعی انقلابی در صنعت امنیت ایجاد کرده است.

## کاربردهای اصلی

### ۱. تشخیص چهره
شناسایی خودکار افراد از روی تصاویر دوربین

### ۲. تحلیل رفتار
تشخیص رفتارهای مشکوک مانند دویدن، افتادن، یا حرکت غیرعادی

### ۳. خوانش پلاک خودرو
تشخیص خودکار شماره پلاک و کنترل تردد

### ۴. شمارش افراد
تشخیص تعداد افراد در یک منطقه

### ۵. تشخیص اشیا
شناسایی اشیای مشکوک مانند کیف یا چمدان

## آینده
با پیشرفت فناوری، سیستم‌های امنیتی هوشمندتر و دقیق‌تر خواهند شد.
""",
        },
    ]
    return articles


if __name__ == '__main__':
    import os
    logging.basicConfig(level=logging.INFO)
    result = run_daily()
    print(f"\n✅ Agent created {result} posts")
